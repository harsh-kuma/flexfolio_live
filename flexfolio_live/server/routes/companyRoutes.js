const express = require("express");
const router = express.Router();

const { searchCompany } = require("../controllers/companyController");
const { protect, } = require("../middlewares/authMiddleware");

router.get("/search",protect, searchCompany);

module.exports = router;