const express = require("express");
const router = express.Router();
const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  createPortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "flexfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createPortfolio);
router.get("/:username", getPortfolio);

module.exports = router;