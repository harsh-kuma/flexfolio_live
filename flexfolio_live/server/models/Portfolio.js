// const mongoose = require("mongoose");

// const portfolioSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: String,
//   location: String,
//   title: String,
//   bio: String,
//   skills: [String],
//   github: String,
//   linkedin: String,
//   image: String,

//   projects: [
//     {
//       title: { type: String, required: true },
//       description: String,
//       github: String,
//       live: String,
//       skills: [String],        // ✅ NEW
//       year: String             // ✅ NEW (or Number)
//     }
//   ],

//   experience: [
//     {
//       company: { type: String, required: true },
//       companyDomain: String,
//       companyLogo: String,
//       role: { type: String, required: true },
//       jobType: { 
//         type: String, 
//         default: "Full-time" 
//       },
//       startDate: Date,
//       endDate: Date,
//       current: { type: Boolean, default: false },
//       description: String,
//       skills: [String], 
//     }
//   ],

//   username: {
//     type: String,
//     unique: true,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Portfolio", portfolioSchema);



const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({

  // 🔥 SYSTEM FIELDS
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