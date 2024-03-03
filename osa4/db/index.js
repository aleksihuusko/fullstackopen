const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUrl = `mongodb+srv://aphuus:${process.env.MONGODB_PASSWORD}@cluster0.h8pvo6y.mongodb.net/blogList?retryWrites=true&w=majority`;
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
