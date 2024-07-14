const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const blogRoutes = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { tokenExtractor } = require("./utils/middleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(tokenExtractor); // Apply tokenExtractor globally

// Apply userExtractor only to routes that need authentication
app.use("/api/blogs", blogRoutes);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const PORT = process.env.PORT || 3003;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    return response.status(400).json({
      error: "Username must be unique",
    });
  }
  next(error);
};

app.use(errorHandler);

module.exports = app; // Export app for testing
