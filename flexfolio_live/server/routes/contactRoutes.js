const express = require("express");
const { sendContactMessage } = require("../controllers/contactController");
const {getPortfolioMessages, markMessageRead ,deleteMessage ,deleteAllMessages} = require("../controllers/messageController");
const {requireFields} =require("../middlewares/requireFields");
const {messageLimiter} = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/contact",requireFields(["portfolioId","email","name","message"]) ,messageLimiter,sendContactMessage);
router.get("/messages/portfolio/:portfolioId",protect,getPortfolioMessages);
router.patch("/messages/:messageId/read",protect,markMessageRead);
router.delete("/messages/:messageId",protect,deleteMessage);
router.delete("/messages/portfolio/:portfolioId",protect,deleteAllMessages);
module.exports =router;