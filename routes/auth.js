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

router.post('/signup', (req, res, next) => {
  console.log('Signup route hit with body:', req.body);
  signup(req, res, next);
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
