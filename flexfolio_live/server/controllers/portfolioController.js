// const Portfolio = require("../models/Portfolio");

// // CREATE
// exports.createPortfolio = async (req, res) => {
//   try {
//     let data = req.body;

//     // Helper to prevent crashes if JSON.parse fails
//     const safeParse = (val) => {
//       try {
//         return JSON.parse(val || "[]");
//       } catch (e) {
//         return [];
//       }
//     };

//     // Parse incoming stringified arrays
//     const skills = safeParse(data.skills);
//     const projects = safeParse(data.projects);
//     const experience = safeParse(data.experience);

//     const image = req.file ? req.file.filename : "";

//     // Better Username Logic: 
//     // Strip special characters and add a dash for readability
//     const cleanName = data.fullName.toLowerCase().replace(/[^a-z0-9]/g, "");
//     const username = `${cleanName}-${Date.now()}`;

//     const newPortfolio = new Portfolio({
//       ...data,
//       skills,
//       projects,
//       experience,
//       image,
//       username,
//     });

//     await newPortfolio.save();

//     res.status(201).json({
//       success: true,
//       username,
//     });
//   } catch (error) {
//     console.error("Backend Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // GET BY USERNAME
// exports.getPortfolio = async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findOne({
//       username: req.params.username,
//     });

//     res.json(portfolio);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };





const Portfolio = require("../models/Portfolio");
const generateUsername = require("../utils/generateUsername");

// CREATE
exports.createPortfolio = async (req, res) => {
  try {

    // 🔥 Parse dynamic form data
    const data = JSON.parse(req.body.data || "{}");

    // 🔥 Template info
    const templateKey = req.body.templateKey;

    const [category, templateSlug] = templateKey.split("-");

    // 🔥 Image handling
    if (req.file) {
      data.image = req.file.filename;
    }


    const username = await generateUsername(data.fullName);

    // 🔥 Create portfolio
    const newPortfolio = new Portfolio({
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