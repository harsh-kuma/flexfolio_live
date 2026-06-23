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
    maxlength: 100,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 255,
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },

  // IT FOR DESHBORD
  isRead: {
    type: Boolean,
    default: false,
  },

  readAt: {
  type: Date,
  default: null,
}

}, { timestamps: true });

contactMessageSchema.index({
  portfolio: 1,
  createdAt: -1,
});

contactMessageSchema.index({
  portfolio: 1,
  isRead: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);