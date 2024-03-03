const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3003;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export app for testing
