const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({

  // OWNER
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // SYSTEM FIELDS
  username: {
    type: String,
    unique: true,
    required: true,
  },

  templateKey: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  templateSlug: {
    type: String,
    required: true,
  },

  // 🔥 COMPLETE TEMPLATE DATA
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },

}, { timestamps: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);