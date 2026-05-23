const Portfolio = require("../models/Portfolio");
const generateUsername = require("../utils/generateUsername");
const User = require("../models/User");

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

    const [category, templateSlug] = templateKey.split("-");

    // Image handling
    if (req.file) {
      data.image = req.file.path;
      data.public_id = req.file.filename;
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

    // Create portfolio
    const newPortfolio = new Portfolio({
      user: id,
      username,
      templateKey,
      category,
      templateSlug,
      title: data.fullName || "Untitled Portfolio",
      thumbnail: data.image || "",
      data,
    });

    await newPortfolio.save();

    res.status(201).json({
      success: true,
      username,
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

    res.json(portfolio);

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
      await Portfolio.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

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

    const { data, title } = req.body;

    if (data) {
      portfolio.data = data;

      portfolio.thumbnail =
        data.image || portfolio.thumbnail;
    }

    if (title) {
      portfolio.title = title;
    }

    await portfolio.save();

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