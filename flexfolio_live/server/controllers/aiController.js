const parseResume = require("../services/resumeParser");
const flexAiService = require("../services/flexAiService");
const AIGeneratedPortfolio = require("../models/AIGeneratedPortfolio");
const mongoose = require("mongoose");
const User = require("../models/User");
const { checkAiUsage } = require("../utils/aiUsage");

exports.generatePortfolioData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }
    const text = await parseResume(req.file.buffer);
    const cleanedText = text.trim();

    const user = await User.findById(req.user.id);

    const usage = checkAiUsage(user);

    // Save if the month changed
    await user.save();

    if (!usage.canGenerate) {
      return res.status(403).json({
        success: false,
        message: "Monthly AI generation limit reached.",
      });
    }
    if (!cleanedText) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in the uploaded PDF.",
      });
    }

    if (cleanedText.length < 200) {
      return res.status(400).json({
        success: false,
        message: "The resume does not contain enough information to generate a portfolio.",
      });
    }

    const MAX_CHARS = 50000;
    if (cleanedText.length > MAX_CHARS) {
      return res.status(400).json({
        success: false,
        message: "The resume contains too much text. Please upload a shorter resume.",
      });
    }

    const data = await flexAiService(cleanedText);

    const generated = await AIGeneratedPortfolio.create({
      user: req.user.id,
      resumeName: req.file.originalname,
      data,
    });

    user.usage.aiGenerations += 1;
    await user.save();

    return res.json({
      success: true,
      generatedId: generated._id,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Generation failed",
    });
  }
};


exports.getGeneratedPortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid generated portfolio id",
      });
    }

    const generated = await AIGeneratedPortfolio.findOne({
      _id: id,
      user: req.user.id,
    }).lean();

    if (!generated) {
      return res.status(404).json({
        success: false,
        message: "Generated portfolio not found",
      });
    }

    return res.json({
      success: true,
      data: generated.data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch generated portfolio",
    });
  }
};