// index.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const photoRoutes = require('./routes/photo');
const pollRoutes = require('./routes/poll');
const countryRoutes = require('./routes/country');

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/countries', countryRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'TrevGuide Backend API is running' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});