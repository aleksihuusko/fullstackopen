const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    const mongoUrl =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
