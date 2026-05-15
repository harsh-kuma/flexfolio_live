const express = require("express");

const {
  register,
  verifyOTP,
  login,
  logout,
  getMe,
  checkOtpAllowed,
  forgotPassword,
  resetPassword,
  checkResetOtpAllowed,
  googleLogin,
} = require("../controllers/authController");

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  authLimiter,
  otpLimiter,
  verifyOtpLimiter,
  loginLimiter,
} = require("../middlewares/rateLimiter");

const {requireFields} =require("../middlewares/requireFields");

const router = express.Router();
router.use(authLimiter);

router.post("/register", requireFields(["name", "email"]), otpLimiter, register);
router.post("/verify-otp", requireFields(["email", "otp" ,"password"]),verifyOtpLimiter, verifyOTP);
router.post("/login",requireFields(["email","password"]),loginLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/check-otp",requireFields(["email"]),verifyOtpLimiter,checkOtpAllowed);
router.post("/forgot-password",requireFields(["email"]),otpLimiter,forgotPassword);
router.post("/reset-password",requireFields(["email","otp","password"]),verifyOtpLimiter,resetPassword);
router.post("/check-reset-otp",requireFields(["email"]),verifyOtpLimiter,checkResetOtpAllowed);
router.post("/google-login",requireFields(["email"]),loginLimiter, googleLogin);

module.exports = router;