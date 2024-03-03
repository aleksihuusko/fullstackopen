const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
