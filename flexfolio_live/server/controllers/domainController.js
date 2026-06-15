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
/** 
 * POST /api/domains
 */
exports.createDomain = async (req, res) => {
  try {
    const { portfolioId, domain } = req.body;

    if (!portfolioId || !domain) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized Access",
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

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const existingPendingDomain = await Portfolio.findOne({
      pendingDomain: normalizedDomain,
    });

    if (!existingPendingDomain) {
      const domainInfo = await addDomainToVercel(normalizedDomain);
      portfolio.vercelVerification = domainInfo.data.verification || [];
    }else{
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

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio || !portfolio.pendingDomain) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const existingVerifiedDomain = await Portfolio.findOne({
      customDomain: portfolio.pendingDomain,
      domainVerified: true,
    });

    if (existingVerifiedDomain) {
      return res.status(404).json({
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
    } else {
      portfolio.domainVerificationError = null;
      portfolio.domainVerified = true;
      portfolio.customDomain = portfolio.pendingDomain;
      portfolio.pendingDomain = null;
      portfolio.domainVerificationToken = null;
    }

    await portfolio.save();

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

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const domain = portfolio.customDomain || portfolio.pendingDomain;

    const safeToDelete = await canDeleteDomain(
      domain,
      portfolio._id
    );

    if (safeToDelete) {
      await removeDomainFromVercel(domain);
    }

    portfolio.customDomain = undefined;
    portfolio.pendingDomain = null;
    portfolio.domainVerificationToken = null;
    portfolio.domainVerified = false;
    portfolio.domainConnectedAt = undefined;
    portfolio.domainVerificationError = null;
    portfolio.vercelVerification = [];

    await portfolio.save();

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

