const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// DB connect
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/portfolio", require("./routes/portfolioRoutes"));

// company suggest route
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/owner", require("./routes/contactRoutes"));

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));