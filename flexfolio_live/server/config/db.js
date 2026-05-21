const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("MongoDB already connected");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error", error);
    process.exit(1);
  }
};

module.exports = connectDB;