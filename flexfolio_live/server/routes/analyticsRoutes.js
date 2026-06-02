const express = require("express");
const {
  getSummary,
  trackEvent,
  getMyAnalyticsSummary,
} = require("../controllers/analyticsController");

const { protect, } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/track", trackEvent);
router.get("/summary/:portfolioId", getSummary);
router.get("/me",protect,getMyAnalyticsSummary);

module.exports = router;