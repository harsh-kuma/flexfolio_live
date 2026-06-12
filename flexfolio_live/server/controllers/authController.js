const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateAccountUsername = require("../utils/generateAccountUsername");

const User = require("../models/User");
const { sendOTP } = require("../utils/sendOTP");
const { validateEmail } = require("../utils/validateEmail");
// reusable part
const { cookieOptions } = require("../utils/cookieOptions");
const { getSafeUser } = require("../utils/getSafeUser");
const { generateOTP } = require("../utils/generateOTP");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


exports.register = async (req, res) => {
  try {
    let { name, email } = req.body;
    email = email.trim().toLowerCase();
    const username = await generateAccountUsername(name);

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    let user = await User.findOne({ email });

    // =========================
    // CASE 1: USER EXISTS
    // =========================
    if (user) {

      // already verified → block
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please login.",
        });
      }

      // =========================
      // CASE 2: NOT VERIFIED USER
      // =========================

      let otp;

      // reuse OTP if still valid
      if (user.otp && user.otpExpiry > Date.now()) {
      } else {
        otp = generateOTP();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        user.otp = otpHash;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendOTP(email, otp);
      }

      return res.json({
        success: true,
        message: "OTP sent to email",
        redirectTo: "/auth/verify-otp",
        email,
      });
    }

    // =========================
    // CASE 3: NEW USER
    // =========================

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }


    const otp = generateOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await User.create({
      name,
      email,
      username,
      otp: otpHash,
      otpExpiry,
      isVerified: false,
    });

    await sendOTP(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      redirectTo: "/auth/verify-otp",
      email,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.otp !== otpHash || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    if (!user.providers) {
      user.providers = [];
    }

    if (!user.providers.includes("credentials")) {
      user.providers.push("credentials");
    }

    await user.save();

    const token = createToken(user);

    res.cookie("token", token, cookieOptions);

    const safeUser = getSafeUser(user);

    res.json({
      success: true,
      user: safeUser,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (!user.isVerified) {

      let otp;

      // reuse OTP if still valid
      if (user.otp && user.otpExpiry > Date.now()) {
        otp = user.otp;
      } else {
        otp = generateOTP();

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendOTP(email, otp);
      }

      return res.status(400).json({
        success: false,
        code: "NOT_VERIFIED",
        message: "Please verify your email first",
        email: user.email,
        redirectTo: "/auth/verify-otp",
      });
    }

    if (!user.providers.includes("credentials")) {
      return res.status(400).json({
        success: false,
        message: "Account created with Google. Please login with Google.",
        code: "USE_GOOGLE_LOGIN",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.cookie("token", token, cookieOptions);

    const safeUser = getSafeUser(user);

    res.json({
      success: true,
      user: safeUser,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.json({
    success: true,
  });
};


exports.getMe = async (req, res) => {

  try {
    const getuser = await User.findById(req.user.id)

    if (!getuser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const user = getSafeUser(getuser);

    res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.checkOtpAllowed = async (req, res) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        allowed: false,
        message: "User Not Found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        allowed: false,
        message: "User already verified",
      });
    }

    return res.json({
      allowed: true,
    });

  } catch (err) {
    res.status(500).json({
      allowed: false,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const now = Date.now();

    if (user.resetPasswordOtp && user.resetPasswordOtpExpiry && user.resetPasswordOtpExpiry > now) {
      return res.status(429).json({
        success: false,
        message: "OTP already sent. Please check your email.",
      });
    }

    const otp = generateOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordOtp = otpHash;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOTP(email, otp);

    res.json({
      success: true,
      message: "Reset OTP sent",
      redirectTo: "/auth/reset-password",
      email,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();

    const otp = req.body.otp.trim();
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (
      user.resetPasswordOtp !== otpHash ||
      user.resetPasswordOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;

    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;

    if (!user.providers) {
      user.providers = [];
    }

    if (!user.providers.includes("credentials")) {
      user.providers.push("credentials");
    }

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
      redirectTo: "/auth/reset-password",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.checkResetOtpAllowed = async (req, res) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        code: "NOT_ALLOWED",
        allowed: false,
        message: "User Not Found",
        redirectTo: "/auth/signup"
      });
    }
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < Date.now()) {
      return res.status(200).json({
        allowed: false,
        message: "Reset OTP expired",
        redirectTo: "/auth/forgot-password",
      });
    }

    return res.json({
      allowed: true,
    });

  } catch (err) {
    res.status(500).json({
      allowed: false,
      message: err.message,
    });
  }
};


exports.googleLogin = async (req, res) => {
  try {
    let { email, name, profile } = req.body;

    email = email.trim().toLowerCase();
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    let user = await User.findOne({ email });

    const googleProfile = profile?.replace(
      /=s\d+-c$/,
      "=s400-c"
    );

    // CASE 1: USER EXISTS
    if (user) {
      if (!user.providers) {
        user.providers = [];
      }
      // ADD GOOGLE IF NOT EXISTS
      if (!user.providers.includes("google")) {
        user.providers.push("google");
      }
      user.isVerified = true;
      if (!user.profile) {
        const uploadedImage = await cloudinary.uploader.upload(
          googleProfile,
          {
            folder: "flexfolio",
          }
        );
        user.profile = uploadedImage.secure_url;
        user.public_id = uploadedImage.public_id;
      }
      await user.save();
    }

    // CASE 2: NEW USER
    else {
      const uploadedImage = await cloudinary.uploader.upload(
        googleProfile,
        {
          folder: "flexfolio",
        }
      );

      const baseUsername = email.split("@")[0];

      const username = name
        ? await generateAccountUsername(name)
        : await generateAccountUsername(baseUsername);

      user = await User.create({
        name,
        email,
        profile: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
        username,
        providers: ["google"],
        isVerified: true,
      });
    }

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      user: getSafeUser(user),
    });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, username } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (name !== undefined) {
      const trimmedName = name.trim();

      if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 50 characters",
        });
      }

      user.name = trimmedName;
    }

    // Update username
    if (username !== undefined) {
      const trimmedUsername = username.trim().toLowerCase();

      if (!/^[a-z0-9-]{3,40}$/.test(trimmedUsername)) { 
        return res.status(400).json({
          success: false,
          message:
            "Username must be 3-40 characters and contain only letters, numbers and hyphen",
        });
      }

      const existingUser = await User.findOne({
        username: trimmedUsername,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }

      user.username = trimmedUsername;
    }

    
    // Update profile image only if uploaded
    if (req.file) {
      if(user.public_id){
        await deleteCloudinaryImage(user.public_id);
      }
      user.profile = req.file.path; // Cloudinary URL or local path
      user.public_id = req.file.filename;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const Portfolio = require("../models/Portfolio");
const ContactMessage = require("../models/ContactMessage");
const Analytics = require("../models/Analytics"); 

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all portfolios
    const portfolios = await Portfolio.find({
      user: userId,
    });

    const portfolioIds = portfolios.map(
      (p) => p._id
    );

    //  Delete Cloudinary images( profile images)
    if (user.public_id) {
      await deleteCloudinaryImage(
        user.public_id
      );
    }

    for (const portfolio of portfolios) {
      // delete  portfolio main image
      if (portfolio.data?.image?.public_id) {
        await deleteCloudinaryImage(
          portfolio.data.image.public_id
        );
      }
    }

    // Delete contact messages
    await ContactMessage.deleteMany({
      portfolio: { $in: portfolioIds },
    });

    // Delete analytics
    await Analytics.deleteMany({
      portfolioId: { $in: portfolioIds },
    });

    // Delete portfolios
    await Portfolio.deleteMany({
      user: userId,
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    // 8. Clear auth cookie
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message:"Account and all associated data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};