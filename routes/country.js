import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Country route working' });
});

export default router;
