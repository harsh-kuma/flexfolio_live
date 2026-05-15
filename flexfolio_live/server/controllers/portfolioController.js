const Portfolio = require("../models/Portfolio");
const generateUsername = require("../utils/generateUsername");

// CREATE
exports.createPortfolio = async (req, res) => {
  try {

    // Parse dynamic form data
    const data = JSON.parse(req.body.data || "{}");

    // Template info
    const templateKey = req.body.templateKey;

    const [category, templateSlug] = templateKey.split("-");

    // Image handling
    if (req.file) {
      data.image = req.file.path;
      data.public_id = req.file.filename;
    }


    const username = await generateUsername(data.fullName);

    // Create portfolio
    const newPortfolio = new Portfolio({
      user: req.user._id,
      username,
      templateKey,
      category,
      templateSlug,
      data,
    });

    await newPortfolio.save();

    res.status(201).json({
      success: true,
      username,
    });

  } catch (error) {
    console.error("Backend Error:", error);

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