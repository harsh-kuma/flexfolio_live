const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createPortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createPortfolio);
router.get("/:username", getPortfolio);

module.exports = router;