const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();



// =========================
// DATABASE
// =========================

connectDB();



// =========================
// MIDDLEWARES
// =========================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());



// =========================
// ROUTES
// =========================

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));

// PORTFOLIO
app.use("/api/portfolio", require("./routes/portfolioRoutes"));

// COMPANY
app.use("/api/company", require("./routes/companyRoutes"));

// CONTACT
app.use("/api/owner", require("./routes/contactRoutes"));



// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Flexfolio API Running");
});



// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});