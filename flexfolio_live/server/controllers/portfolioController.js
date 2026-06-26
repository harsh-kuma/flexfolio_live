const Portfolio = require("../models/Portfolio");
const generateUsername = require("../utils/generateUsername");
const { validateEmail } = require("../utils/validateEmail");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const deleteCloudinaryAsset = require("../utils/deleteCloudinaryAsset");
const Contact = require("../models/ContactMessage");
const { getLimit } = require("../utils/access");
const { sendContactVerificationEmail } = require("../utils/sendContactVerificationEmail");
const crypto = require("crypto");
const { generateOTP } = require("../utils/generateOTP");
const { getSafePortfolio } = require("../utils/getSafePortfolio");
const RESERVED_USERNAMES = require("../utils/reservedUsernames");
const { removeDomainFromVercel } = require("../services/domainService");
const { canDeleteDomain } = require("../utils/domainCleanup");
const { refreshDomainStatus } = require("../services/domainSyncService");
const deleteAssetsFromObject = require("../utils/deleteAssetsFromObject");
const getResourceType = require("../utils/getResourceType");
const extractAssets = require("../utils/extractAssets");
// CREATE

function setNestedValue(
  obj,
  path,
  value
) {
  const keys = path.split(".");

  let current = obj;

  while (keys.length > 1) {
    const key = keys.shift();

    if (
      current[key] === undefined
    ) {
      current[key] =
        /^\d+$/.test(keys[0])
          ? []
          : {};
    }

    current = current[key];
  }

  current[keys[0]] = value;
}

const cleanupUploadedFiles = async (files = []) => {
  if (!files?.length) return;

  await Promise.allSettled(
    files.map((file) =>
      deleteCloudinaryAsset(
        file.filename,
        getResourceType(file.mimetype)
      )
    )
  );
};

exports.createPortfolio = async (req, res) => {
  try {
    // Parse dynamic form data
    let data = {};
    try {
      data = JSON.parse(req.body.data || "{}");
    } catch (err) {
      await cleanupUploadedFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Invalid form data",
      });
    }
    // Template info
    const templateKey = req.body.templateKey;

    const [category, templateSlug] = templateKey.split("~");

    // Image handling
    if (req.files && req.files.length) {
      for (const file of req.files) {
        setNestedValue(
          data,
          file.fieldname,
          {
            url: file.path,
            public_id: file.filename,
            resource_type: getResourceType(file.mimetype),
            bytes: file.size
          }
        );
      }
    }


    const username = await generateUsername(data.fullName);

    const id = req.user.id;

    const user = await User.findById(id);

    if (!user || !user.isVerified) {
      await cleanupUploadedFiles(req.files);
      return res.status(404).json({
        success: false,
        message: "Unauthorized Creation",
      });
    }

    const email = data.email?.trim().toLowerCase();

    if (!email) {
      await cleanupUploadedFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validateEmail(email)) {
      await cleanupUploadedFiles(req.files);
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
      await cleanupUploadedFiles(req.files);
      return res.status(403).json({
        success: false,
        message: "Portfolio limit reached. Upgrade your plan."
      });
    }

    const uploadedFiles = req.files?.length || 0;
    const mediaLimit = getLimit(user, "maxMediaFiles");
    if (mediaLimit !== -1 && user.usage.mediaFiles + uploadedFiles > mediaLimit) {
      await cleanupUploadedFiles(req.files);
      return res.status(403).json({
        success: false,
        message: "Media limit reached"
      });
    }

    const uploadedSize = req.files?.reduce((sum, file) => sum + file.size, 0);
    const storageLimit = getLimit(user, "storageLimit");
    if (storageLimit !== -1 && user.usage.storageUsed + uploadedSize > storageLimit) {
      await cleanupUploadedFiles(req.files);
      return res.status(403).json({
        success: false,
        message: "Storage limit reached"
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
        "usage.portfolios": 1,
        "usage.mediaFiles": uploadedFiles,
        "usage.storageUsed": uploadedSize
      }
    });

    res.status(201).json({
      success: true,
      _id: newPortfolio._id,
    });

  } catch (error) {
    await cleanupUploadedFiles(req.files);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET BY USERNAME or domain
exports.getPortfolio = async (req, res) => {
  try {
    let portfolio;
    if (req?.params?.domain) {
      const domain = req.params.domain.toLowerCase().replace(/^www\./, "").trim();
      portfolio = await Portfolio.findOne({
        customDomain: domain,
        domainVerified: true,
      });
    } else {
      portfolio = await Portfolio.findOne({
        username: req.params.username,
      });
    }
    if (!portfolio || !portfolio.isPublished) {
      return res.status(200).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }
    const owner = await User.findById(portfolio.user).select("subscription.plan");
    let Safeportfolio = getSafePortfolio(portfolio);

    const userPlan = owner?.subscription?.plan || "free";

    Safeportfolio.features = {
      removeBranding : userPlan !== "free",
      analytics: userPlan !== "free",
      advancedAnalytics: userPlan === "pro",
    };
    
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

    const assets = extractAssets(portfolio.data);
    const deletedFiles = assets.length;

    const deletedSize =
      assets.reduce(
        (sum, asset) =>
          sum + (asset.bytes || 0),
        0
      );

    // delete cloudinary image first
    await deleteAssetsFromObject(
      portfolio.data
    );

    // delete all contacts related to portfolio
    await Contact.deleteMany({
      portfolio: portfolio._id,
    });

    // delete all analytics related to portfolio
    await Analytics.deleteMany({
      portfolioId: portfolio._id,
    });

    // Delete the domain from versel if avalible .

    const domain = portfolio.customDomain || portfolio.pendingDomain;
    if (domain) {
      const safeToDelete = await canDeleteDomain(
        domain,
        portfolio._id
      );

      if (safeToDelete) {
        await removeDomainFromVercel(domain);
      }
    }
    // then delete portfolio
    await portfolio.deleteOne();

    const updateInc = {
      "usage.portfolios": -1,
      "usage.mediaFiles": -deletedFiles,
      "usage.storageUsed": -deletedSize
    };

    if (portfolio.domainVerified) {
      updateInc["usage.domains"] = -1;
    }

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: updateInc
      }
    );

    await User.updateOne(
      {
        _id: req.user.id,
        "usage.domains": { $lt: 0 }
      },
      {
        $set: {
          "usage.domains": 0
        }
      }
    );

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
      await cleanupUploadedFiles(req.files);
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }


    let data = req.body.data;

    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
    } catch {
      await cleanupUploadedFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Invalid form data",
      });
    }

    // STEP 1: normalize string image (VERY IMPORTANT) because frontend send only image:https not object
    // if (typeof data?.image === "string" && data.image !== "") {
    //   data.image = {
    //     url: data.image,
    //     public_id: portfolio.data?.image?.public_id || null,
    //     resource_type: portfolio.data?.image?.resource_type || "image",
    //   };
    // }

    if (req.files && req.files.length) {
      for (const file of req.files) {
        setNestedValue(
          data,
          file.fieldname,
          {
            url: file.path,
            public_id: file.filename,
            resource_type: getResourceType(file.mimetype),
            bytes: file.size
          }
        );
      }
    }


    const oldEmail = portfolio.data?.email;
    const newEmail = data.email?.trim().toLowerCase();

    if (newEmail) {
      if (!validateEmail(newEmail)) {
        await cleanupUploadedFiles(req.files);
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

    if (data.image === "") {
      data.image = null;
    }

    if (data.resume === "") {
      data.resume = null;
    }

    const oldAssets = extractAssets(portfolio.data);

    const updatedData = {
      ...portfolio.data,
      ...data,
    };

    const newAssets = extractAssets(updatedData);

    const removedAssets = oldAssets.filter(
      (oldAsset) =>
        !newAssets.some(
          (newAsset) =>
            newAsset.public_id === oldAsset.public_id
        )
    );

    const addedAssets = newAssets.filter(newAsset => !oldAssets.some(
      oldAsset => oldAsset.public_id === newAsset.public_id
    ));

    const removedCount = removedAssets.length;
    const addedCount = addedAssets.length;

    const removedSize = removedAssets.reduce(
      (sum, asset) =>
        sum + (asset.bytes || 0),
      0
    );

    const addedSize = addedAssets.reduce(
      (sum, asset) =>
        sum + (asset.bytes || 0),
      0
    );


    const user = await User.findById(req.user.id);
    const newMediaUsage = user.usage.mediaFiles + addedCount - removedCount;
    const newStorageUsage = user.usage.storageUsed + addedSize - removedSize;
    const mediaLimit = getLimit(user, "maxMediaFiles");
    if (mediaLimit !== -1 && newMediaUsage > mediaLimit) {
      await cleanupUploadedFiles(req.files);
      return res.status(403).json({
        success: false,
        message: "Media limit reached"
      });
    }

    const storageLimit = getLimit(user, "storageLimit");
    if (storageLimit !== -1 && newStorageUsage > storageLimit) {
      await cleanupUploadedFiles(req.files);
      return res.status(403).json({
        success: false,
        message: "Storage limit reached"
      });
    }

     for (const asset of removedAssets) {
      try {
        await deleteCloudinaryAsset(
          asset.public_id,
          asset.resource_type
        );
      } catch (err) {
        console.error(
          `Failed to delete ${asset.public_id}`,
          err
        );
      }
    }

    portfolio.data = updatedData;
    portfolio.thumbnail = portfolio.data?.image?.url || "";

    if (req.body.title) {
      portfolio.title = req.body.title;
    }

    await portfolio.save();

    if (removedCount || addedCount || removedSize || addedSize) {
      await User.findByIdAndUpdate(req.user.id,
        {
          $inc: {
            "usage.mediaFiles": addedCount - removedCount,
            "usage.storageUsed": addedSize - removedSize
          }
        }
      );
    }
    const Safeportfolio = getSafePortfolio(portfolio);
    res.json({
      success: true,
      portfolio: Safeportfolio,
    });
  } catch (error) {
    await cleanupUploadedFiles(req.files);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPortfolioForManage = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select(
      "_id user title username isPublished emailVerified thumbnail templateKey email customDomain pendingDomain domainVerificationToken  domainVerified domainConnectedAt domainVerificationError vercelVerification createdAt updatedAt"
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio?.customDomain) {
      await refreshDomainStatus(portfolio);

      portfolio = await Portfolio.findById(portfolio._id).select(
        "_id title username isPublished emailVerified thumbnail templateKey email customDomain pendingDomain domainVerificationToken domainVerified domainConnectedAt domainVerificationError vercelVerification createdAt updatedAt"
      );
    }

    const portfolioObj = portfolio.toObject();

    if (portfolio.pendingDomain) {
      portfolioObj.dnsRecords = [
        {
          type: "A",
          host: "@",
          value: "216.198.79.1",
        },
        {
          type: "TXT",
          host: "_flexfolio",
          value: portfolio.domainVerificationToken,
        },
        ...portfolio.vercelVerification.map(v => ({
          type: v.type,
          host: v.domain.replace(
            `.${portfolio.pendingDomain}`,
            ""
          ),
          value: v.value,
        })),
      ];
    }
    res.json({
      success: true,
      portfolio: portfolioObj,
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