const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
app.set("trust proxy", 1);


// =========================
// DATABASE
// =========================

connectDB();

app.use(helmet());

app.use(compression());


// =========================
// MIDDLEWARES
// =========================

// Define the allowed origins as an array
const allowedOrigins = [
  'https://flexfolio.online',
  'https://www.flexfolio.online',
  'http://localhost:3000' // Keeps your local development working!
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      }
    },
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

// ANALYTICS FREE
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Flexfolio API Running");
});



// =========================
// SERVER
// =========================
app.use((err, req, res, next) => {
  console.error("Error:", err);

  //  Multer specific errors
  if (err instanceof multer.MulterError) {
    let message = "File upload error";

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum allowed size is 2MB.";
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field.";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  //  Custom errors (like fileFilter)
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  //  Default server error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});