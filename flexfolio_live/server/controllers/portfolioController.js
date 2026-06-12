const Portfolio = require("../models/Portfolio");
const generateUsername = require("../utils/generateUsername");
const { validateEmail } = require("../utils/validateEmail");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");
const Contact = require("../models/ContactMessage");
const { getLimit } = require("../utils/access");
const { sendContactVerificationEmail } = require("../utils/sendContactVerificationEmail");
const crypto = require("crypto");
const { generateOTP } = require("../utils/generateOTP");
const { getSafePortfolio } = require("../utils/getSafePortfolio");
const RESERVED_USERNAMES = require("../utils/reservedUsernames");

// CREATE
exports.createPortfolio = async (req, res) => {
  try {
    // Parse dynamic form data
    let data = {};
    try {
      data = JSON.parse(req.body.data || "{}");
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid form data",
      });
    }
    // Template info
    const templateKey = req.body.templateKey;

    const [category, templateSlug] = templateKey.split("~");

    // Image handling
    if (req.file) {
      data.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }


    const username = await generateUsername(data.fullName);

    const id = req.user.id;

    const user = await User.findById(id);

    if (!user || !user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Creation",
      });
    }

    const email = data.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    let emailVerified = false;

    if (user.email && email === user.email.trim().toLowerCase()) {
      emailVerified = true;
    }

    const portfolioCount = user.usage.portfolios;

    const limit = getLimit(user, "maxPortfolios");

    if (limit !== -1 && portfolioCount >= limit) {
      return res.status(403).json({
        success: false,
        message: "Portfolio limit reached. Upgrade your plan."
      });
    }

    // Create portfolio
    const newPortfolio = new Portfolio({
      user: id,
      username,
      templateKey,
      category,
      templateSlug,
      title: data.fullName || "Untitled Portfolio",
      thumbnail: data.image?.url || "",
      data,
      email,
      emailVerified,
    });

    await newPortfolio.save();

    await User.findByIdAndUpdate(id, {
      $inc: {
        "usage.portfolios": 1
      }
    });

    res.status(201).json({
      success: true,
      _id: newPortfolio._id,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET BY USERNAME
exports.getPortfolio = async (req, res) => {
  try {

    const portfolio = await Portfolio.findOne({
      username: req.params.username,
    });
    if (!portfolio || !portfolio.isPublished) {
      return res.status(200).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }
    const Safeportfolio = getSafePortfolio(portfolio);
    res.json(Safeportfolio);

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};

exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "_id title username templateKey thumbnail isPublished updatedAt"
      );

    res.json({
      success: true,
      portfolios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio =
      await Portfolio.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // delete cloudinary image first
    await deleteCloudinaryImage(
      portfolio.data?.image?.public_id
    );

    // delete all contacts related to portfolio
    await Contact.deleteMany({
      portfolio: portfolio._id,
    });

    // delete all analytics related to portfolio
    await Analytics.deleteMany({
      portfolioId: portfolio._id,
    });

    // then delete portfolio
    await portfolio.deleteOne();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        "usage.portfolios": -1
      }
    });

    res.json({
      success: true,
      message: "Portfolio deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }
    const Safeportfolio = getSafePortfolio(portfolio);
    res.json({
      success: true,
      portfolio: Safeportfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    let data = req.body.data;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // STEP 1: normalize string image (VERY IMPORTANT) because frontend send only image:https not object
    if (typeof data?.image === "string") {
      data.image = {
        url: data.image,
        public_id: portfolio.data?.image?.public_id || null,
      };
    }

    if (req.file) {
      if (portfolio.data?.image?.public_id) {
        await deleteCloudinaryImage(
          portfolio.data.image.public_id
        );
      }

      data.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    if (!req.file && !data?.image) {
      data.image = portfolio.data?.image;
    }

    const oldEmail = portfolio.data?.email;
    const newEmail = data.email?.trim().toLowerCase();

    if (newEmail) {
      if (!validateEmail(newEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const user = await User.findById(req.user.id);

      // If email changed → reset verification
      if (newEmail !== oldEmail?.trim().toLowerCase()) {
        portfolio.email = newEmail;
        portfolio.emailVerified = false;
      }

      // Auto verify if same as user email
      if (user?.email && newEmail === user.email.trim().toLowerCase()) {
        portfolio.emailVerified = true;
      }
    }


    portfolio.data = {
      ...portfolio.data,
      ...data,
    };
    portfolio.thumbnail = data?.image?.url || portfolio.thumbnail;

    if (req.body.title) {
      portfolio.title = req.body.title;
    }

    await portfolio.save();
    const Safeportfolio = getSafePortfolio(portfolio);
    res.json({
      success: true,
      portfolio: Safeportfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPortfolioForManage = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select(
      "_id title username isPublished emailVerified thumbnail templateKey email createdAt updatedAt"
    );;

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({
      success: true,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.setPublishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.isPublished = true;

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio published successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.setUnPublishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.isPublished = false;

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio unpublished successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.sendPortfolioVerificationEmail = async (req, res) => {
  try {
    const { id } = req.body;
    const portfolio = await Portfolio.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const now = Date.now();

    const isOtpValid =
      portfolio.emailVerificationOtp &&
      portfolio.emailVerificationExpires &&
      portfolio.emailVerificationExpires > now;

    if (isOtpValid) {
      return res.json({
        success: true,
        message: "OTP already sent. Please check your email.",
      });
    }

    const otp = generateOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    portfolio.emailVerificationOtp = otpHash;
    portfolio.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await portfolio.save();

    // send email only for new OTP
    await sendContactVerificationEmail(portfolio.email, otp, portfolio.title);

    return res.json({
      success: true,
      message: "New OTP generated and sent to email",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.verifyPortfolioEmailOtp = async (req, res) => {
  try {
    const { id, otp } = req.body;

    const portfolio = await Portfolio.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const now = Date.now();
    if (
      !portfolio.emailVerificationOtp ||
      !portfolio.emailVerificationExpires
    ) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request again.",
      });
    }

    if (portfolio.emailVerificationExpires < now) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (portfolio.emailVerificationOtp !== otpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    portfolio.emailVerified = true;
    portfolio.emailVerificationOtp = null;
    portfolio.emailVerificationExpires = null;

    await portfolio.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updatePortfolioGeneralDetail = async (req, res) => {
  try {
    const { title, username } = req.body.form;
    const { id } = req.body;

    const portfolio = await Portfolio.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Username validation
    if (username !== undefined) {
      const normalizedUsername = username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

      if (!normalizedUsername) {
        return res.status(400).json({
          success: false,
          message: "Username is required",
        });
      }

      if (RESERVED_USERNAMES.has(normalizedUsername)) {
        return res.status(400).json({
          success: false,
          message: "This username is reserved. Please choose another one.",
        });
      }

      // Check if username is already used by another portfolio
      const existingPortfolio = await Portfolio.findOne({
        username: normalizedUsername,
        _id: { $ne: portfolio._id },
      });

      if (existingPortfolio) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }

      if (!/^[a-z0-9-]{3,40}$/.test(normalizedUsername)) {
        return res.status(400).json({
          success: false,
          message:
            "Username must be 3-40 characters and contain only letters, numbers and hyphen",
        });
      }

      portfolio.username = normalizedUsername;
    }

    // Title validation
    if (title !== undefined) {
      const normalizedTitle = title.trim().replace(/\s+/g, " ");

      if (!normalizedTitle) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      portfolio.title = normalizedTitle;
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: "General details updated successfully",
      portfolio: {
        _id: portfolio._id,
        username: portfolio.username,
        title: portfolio.title,
      },
    });
  } catch (error) {
    console.error("Update Portfolio General Detail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getPreviewPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      username: req.params.username,
      user: req.user.id,
    });
    if (!portfolio) {
      return res.status(200).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }
    const Safeportfolio = getSafePortfolio(portfolio);
    res.json(Safeportfolio);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};