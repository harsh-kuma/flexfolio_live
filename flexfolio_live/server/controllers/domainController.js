const Portfolio = require("../models/Portfolio");
const {
  addDomainToVercel,
  getDomainInfo,
  removeDomainFromVercel,
} = require("../services/domainService");

const {
  verifyFlexfolioToken,
} = require("../services/dnsService");

const validator = require("validator");
const crypto = require("crypto");

const { canDeleteDomain } = require("../utils/domainCleanup");
const User = require("../models/User");
const { getLimit } = require("../utils/access");
/** 
 * POST /api/domains
 */
exports.createDomain = async (req, res) => {
  try {
    const { portfolioId, domain } = req.body;
    const user = await User.findById(req.user.id);
    if (!portfolioId || !domain || !user) {
      return res.status(400).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const domainLimit = getLimit(user, "maxDomains");

    if (domainLimit !== -1 && user.usage.domains >= domainLimit) {
      return res.status(403).json({
        success: false,
        message: "Domain limit reached. Upgrade your plan."
      });
    }

    const normalizedDomain = domain.toLowerCase().trim();

    if (!validator.isFQDN(normalizedDomain)) {
      return res.status(400).json({
        success: false,
        message: "Invalid domain name",
      });
    }

    const existingDomain = await Portfolio.findOne({
      customDomain: normalizedDomain,
      domainVerified: true,
    });

    if (existingDomain) {
      return res.status(409).json({
        success: false,
        message: "This Domain Already In Use ..",
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio.customDomain || portfolio.pendingDomain) {
      return res.status(400).json({
        success: false,
        message: "Remove existing domain before adding a new one"
      });
    }

    const existingPendingDomain = await Portfolio.findOne({
      pendingDomain: normalizedDomain,
      _id: { $ne: portfolio._id }
    });

    if (!existingPendingDomain) {
      const domainInfo = await addDomainToVercel(normalizedDomain);
      portfolio.vercelVerification = domainInfo.data.verification || [];
    } else {
      portfolio.vercelVerification = existingPendingDomain.vercelVerification || [];
    }

    const flexfolioToken = crypto.randomBytes(16).toString("hex");
    portfolio.domainVerificationToken = flexfolioToken
    portfolio.pendingDomain = normalizedDomain;
    portfolio.domainVerified = false;
    portfolio.domainConnectedAt = new Date();
    portfolio.domainVerificationError = null;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: "Domain added successfully",
      domain: normalizedDomain,

      dnsRecords: [
        {
          type: "A",
          host: "@",
          value: "216.198.79.1",
        },
        {
          type: "TXT",
          host: "_flexfolio",
          value: flexfolioToken,
        },
        ...portfolio.vercelVerification.map(v => ({
          type: v.type,
          host: v.domain.replace(
            `.${portfolio.pendingDomain}`,
            ""
          ),
          value: v.value,
        })),
      ],
    });
  } catch (error) {
    console.error("Create Domain Error:", error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
};

/**
 * POST /api/domains/verify
 */
exports.verifyDomain = async (req, res) => {
  try {
    const { portfolioId } = req.body;
    const user = await User.findById(req.user.id);
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id
    });

    if (!portfolio || !portfolio.pendingDomain || !user) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio.domainVerified) {
      return res.status(400).json({
        success: false,
        message: "Domain already verified"
      });
    }

    const domainLimit = getLimit(user, "maxDomains");
    if (domainLimit !== -1 && user.usage.domains >= domainLimit) {
      return res.status(403).json({
        success: false,
        message: "Domain limit reached. Upgrade your plan."
      });
    }

    const existingVerifiedDomain = await Portfolio.findOne({
      customDomain: portfolio.pendingDomain,
      domainVerified: true,
      _id: { $ne: portfolio._id }
    });

    if (existingVerifiedDomain) {
      return res.status(409).json({
        success: false,
        message: "This Domain Already In Use ..",
      });
    }

    const response = await getDomainInfo(
      portfolio.pendingDomain
    );

    const vercelVerified = response.data?.verified === true;

    const tokenVerified = await verifyFlexfolioToken(
      portfolio.pendingDomain,
      portfolio.domainVerificationToken
    );

    const verified = vercelVerified && tokenVerified;

    portfolio.domainVerified = verified;

    if (!verified) {
      if (!vercelVerified) {
        portfolio.domainVerificationError = "Domain is not connected to FlexFolio";
      }
      else if (!tokenVerified) {
        portfolio.domainVerificationError = "TXT verification record missing";
      }
      else {
        portfolio.domainVerificationError = null;
      }
      await portfolio.save();
    }

    if (verified) {

      const result = await User.updateOne(
        {
          _id: req.user.id,
          ...(domainLimit !== -1
            ? { "usage.domains": { $lt: domainLimit } }
            : {})
        },
        {
          $inc: {
            "usage.domains": 1
          }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(403).json({
          success: false,
          message: "Domain limit reached"
        });
      }

      portfolio.domainVerificationError = null;
      portfolio.domainVerified = true;
      portfolio.customDomain = portfolio.pendingDomain;
      portfolio.pendingDomain = null;
      portfolio.domainVerificationToken = null;

      await portfolio.save();
    }

    return res.status(200).json({
      success: true,
      verified: portfolio.domainVerified,
      error: portfolio.domainVerificationError,
    });
  } catch (error) {
    console.error("Verify Domain Error:", error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
};

/**
 * DELETE /api/domains
 */
exports.deleteDomain = async (req, res) => {
  try {
    const { portfolioId } = req.body;

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const domain = portfolio.customDomain || portfolio.pendingDomain;

    const safeToDelete = await canDeleteDomain(
      domain,
      portfolio._id
    );

    if (safeToDelete) {
      try {
        await removeDomainFromVercel(domain);
      } catch (err) {
        console.error(
          "Vercel domain deletion failed:",
          err.message
        );
      }
    }

    const wasVerified = portfolio.domainVerified;
    portfolio.customDomain = null;
    portfolio.pendingDomain = null;
    portfolio.domainVerificationToken = null;
    portfolio.domainVerified = false;
    portfolio.domainConnectedAt = null;
    portfolio.domainVerificationError = null;
    portfolio.vercelVerification = [];

    await portfolio.save();

    if (wasVerified) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            "usage.domains": -1
          }
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
    }

    return res.status(200).json({
      success: true,
      message: "Domain removed successfully",
    });
  } catch (error) {
    console.error("Delete Domain Error:", error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
};

