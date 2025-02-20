import express from 'express';
import { signup, login } from '../controllers/auth.js';

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log('Auth route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

// Single signup route handler for both /register and /signup
router.post(['/register', '/signup'], async (req, res, next) => {
  try {
    console.log('Signup attempt with body:', req.body);
    await signup(req, res, next);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Signup failed', 
      error: error.message 
    });
  }
});

router.post('/login', login);

// Test endpoint to verify route configuration
router.get('/', (req, res) => {
  res.json({ status: 'Auth routes working' });
});

// Debug endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

export default router;
