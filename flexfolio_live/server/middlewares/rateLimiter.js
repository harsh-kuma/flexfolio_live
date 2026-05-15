const rateLimit = require("express-rate-limit");

//  GENERAL AUTH LIMIT IT FOR ALL AUTH UNDER IT
exports.authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 min
  max: 20,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP SEND LIMIT
exports.otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 3,
  message: {
    success: false,
    message:
      "Too many OTP requests. Please wait 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  OTP VERIFY LIMIT
exports.verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many verification attempts.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  LOGIN LIMIT
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many login attempts. Try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


exports.messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message:
      "Too many Messages. Try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});