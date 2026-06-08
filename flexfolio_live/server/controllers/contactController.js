const Portfolio = require("../models/Portfolio");
const ContactMessage = require("../models/ContactMessage");
const { sendContactMail } = require("../utils/sendContactMail");

exports.sendContactMessage = async (req, res) => {
  try {

    const { portfolioId, name, email, message, } = req.body;

    // VALIDATION
    if (!portfolioId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK PORTFOLIO EXISTS
    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const contactMessage =
      await ContactMessage.create({
        portfolio: portfolio._id,
        name,
        email,
        message,
      });

    if(portfolio.emailVerified){
      await sendContactMail({
      ownerEmail: portfolio.data.email,
      ownerName: portfolio.data.fullName,

      senderName: name,
      senderEmail: email,
      message,
    });
    }
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contactMessage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};