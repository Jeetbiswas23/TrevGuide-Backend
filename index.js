import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import photoRoutes from './routes/photo';
import pollRoutes from './routes/poll';
import countryRoutes from './routes/country';

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