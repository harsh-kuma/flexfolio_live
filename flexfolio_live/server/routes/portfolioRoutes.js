const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  getPortfolio,
  getMyPortfolios,
  deletePortfolio,
  getPortfolioById,
  updatePortfolio,
  getPortfolioForManage,
  setPublishPortfolio,
  setUnPublishPortfolio,
  sendPortfolioVerificationEmail,
  verifyPortfolioEmailOtp,
  updatePortfolioGeneralDetail,
  getPreviewPortfolio,
} = require("../controllers/portfolioController");

const { protect, } = require("../middlewares/authMiddleware");

// Cloudinary storage
const upload = require("../middlewares/uploadMiddleware");

// Routes
router.post("/", upload.single("image"),protect, createPortfolio);
router.get("/me",protect,getMyPortfolios);
router.get("/edit/:id",protect,getPortfolioById);
router.put("/:id",protect,upload.single("image"),updatePortfolio);
router.delete("/:id",protect,deletePortfolio);
router.get("/:username", getPortfolio);
router.get("/manage/:id",protect,getPortfolioForManage);
router.get("/publish/:id",protect,setPublishPortfolio);
router.get("/unpublish/:id",protect,setUnPublishPortfolio);
router.post("/send-verify-email",protect,sendPortfolioVerificationEmail);
router.post("/verify-email",protect,verifyPortfolioEmailOtp);
router.post("/general-details",protect,updatePortfolioGeneralDetail);
router.get("/preview/:username",protect, getPreviewPortfolio);

module.exports = router;