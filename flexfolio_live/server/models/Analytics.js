const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      enum: [
        "view",
        "click",
        "session",
      ],
      required: true,
    },

    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    // resume, github, linkedin, email, project_live, project_code, contact_form
    meta: {
      type: String,
      default: null,
      trim: true,
    },

    // session duration in seconds
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    ip: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

// Main analytics queries
analyticsSchema.index({
  portfolioId: 1,
  eventType: 1,
  createdAt: -1,
});

// Visitor lookups
analyticsSchema.index({
  portfolioId: 1,
  visitorId: 1,
});

// Dashboard charts
analyticsSchema.index({
  portfolioId: 1,
  createdAt: -1,
});

// Click analytics
analyticsSchema.index({
  portfolioId: 1,
  meta: 1,
});

// Session analytics
analyticsSchema.index({
  portfolioId: 1,
  duration: -1,
});

/*
|--------------------------------------------------------------------------
| UNIQUE VIEW PROTECTION
|--------------------------------------------------------------------------
| Prevent duplicate views from same visitor.
| Clicks and sessions remain unlimited.
*/

analyticsSchema.index(
  {
    portfolioId: 1,
    visitorId: 1,
    eventType: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      eventType: "view",
    },
  }
);

/*
|--------------------------------------------------------------------------
| AUTO DELETE AFTER 15 DAYS
|--------------------------------------------------------------------------
*/

analyticsSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: 60 * 60 * 24 * 15,
  }
);

module.exports = mongoose.model(
  "Analytics",
  analyticsSchema
);