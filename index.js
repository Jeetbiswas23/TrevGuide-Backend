import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import photoRoutes from './routes/photos.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ['https://trevguide.vercel.app/', 'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Create uploads directory for photos
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/photos', photoRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'TrevGuide API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
