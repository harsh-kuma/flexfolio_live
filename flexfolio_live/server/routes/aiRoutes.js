const router = require("express").Router();
const upload = require("../middlewares/aiUpload");
const {generatePortfolioData, getGeneratedPortfolio} = require("../controllers/aiController");
const { protect, } = require("../middlewares/authMiddleware");

router.post("/generate",protect,upload.single("resume"),generatePortfolioData);
router.get("/generated/:id",protect,getGeneratedPortfolio);

module.exports = router;