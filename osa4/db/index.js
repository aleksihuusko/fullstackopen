const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const password = 1234; // Consider moving sensitive information to environment variables
    const mongoUrl = `mongodb+srv://aphuus:${password}@cluster0.h8pvo6y.mongodb.net/blogList?retryWrites=true&w=majority`;
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
