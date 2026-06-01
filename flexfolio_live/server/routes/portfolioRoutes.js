const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  getPortfolio,
  getMyPortfolios,
  deletePortfolio,
  getPortfolioById,
  updatePortfolio,
} = require("../controllers/portfolioController");

const { protect, } = require("../middlewares/authMiddleware");

// Cloudinary storage
const upload = require("../middlewares/uploadMiddleware");

// Routes
router.post("/", upload.single("image"),protect, createPortfolio);
router.get("/me",protect,getMyPortfolios);
router.get("/manage/:id",protect,getPortfolioById);
router.put("/:id",protect,upload.single("image"),updatePortfolio);
router.delete("/:id",protect,deletePortfolio);
router.get("/:username", getPortfolio);

module.exports = router;