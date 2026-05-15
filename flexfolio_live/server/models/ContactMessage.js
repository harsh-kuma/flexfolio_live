const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({

  //  WHICH PORTFOLIO RECEIVED MESSAGE
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true,
  },

  //  WHO SENT MESSAGE
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  // IT FOR DESHBORD
  isRead: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);