const express = require("express");
const router = express.Router();
const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  createPortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");

const { protect, } = require("../middlewares/authMiddleware");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "flexfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Routes
router.post("/", upload.single("image"),protect, createPortfolio);
router.get("/:username", getPortfolio);

module.exports = router;