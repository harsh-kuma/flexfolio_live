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
    lowercase: true,
    trim: true,
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

  // DASHBOARD
  title: {
    type: String,
    default: "Untitled Portfolio",
  },

  thumbnail: {
    type: String,
    default: "",
  },

  isPublished: {
    type: Boolean,
    default: false,
  },

  // EMAIL SECTION
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationOtp: String,
  emailVerificationExpires: Date,

  // COMPLETE TEMPLATE DATA
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },

customDomain: {
  type: String,
  unique: true, 
  sparse: true,
  lowercase: true,
  trim: true,
},

domainVerified: {
  type: Boolean,
  default: false,
},

}, { timestamps: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);