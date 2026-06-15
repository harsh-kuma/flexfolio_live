const express = require("express");

const router = express.Router();

const {
  createDomain,
  verifyDomain,
  deleteDomain,
} = require("../controllers/domainController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createDomain);

router.post("/verify", protect, verifyDomain);

router.delete("/", protect, deleteDomain);

module.exports = router;