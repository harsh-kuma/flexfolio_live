const express = require("express");
const { sendContactMessage } = require("../controllers/contactController");
const {requireFields} =require("../middlewares/requireFields");
const {messageLimiter} = require("../middlewares/rateLimiter");
const router = express.Router();

router.post("/contact",requireFields(["portfolioId","email","name","message"]) ,messageLimiter,sendContactMessage);

module.exports =router;