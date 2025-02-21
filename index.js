import dotenv from 'dotenv';
// Load env vars before other imports
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import photoRoutes from './routes/photo.js';
import pollRoutes from './routes/poll.js';
import countryRoutes from './routes/country.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();

// Debug middleware to log env vars (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment variables loaded:', {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  });
}

// Connect to the database
connectDB();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());
app.use(limiter);

// Debug middleware (move before routes)
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

// Add redirect for root-level signup endpoint
app.post('/signup', (req, res) => {
  res.redirect(307, '/api/auth/signup');
});

// Routes - change path to match frontend
app.use('/api/auth', authRoutes);

// Add route debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'API is working',
    routes: {
      auth: '/api/auth',
      register: '/api/auth/register', // Added register endpoint
      signup: '/api/auth/signup',
      login: '/api/auth/login'
    }
  });
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'TrevGuide Backend API is running' });
});

// Add 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// More detailed error handling
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});