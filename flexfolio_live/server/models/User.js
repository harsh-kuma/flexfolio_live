const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null,
    },

    username: {
      type: String,
      unique: true,
    },

    profile: {
      type: String,
      default: null,
    },

    public_id: {
      type: String,
      default: null,
    },

    providers: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every(v => ["credentials", "google"].includes(v)),
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: String,
    otpExpiry: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,

    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
      },

      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active"
      },

      startDate: {
        type: Date,
        default: null
      },

      endDate: {
        type: Date,
        default: null
      }
    },

    usage: {
      portfolios: {
        type: Number,
        default: 0
      },
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);