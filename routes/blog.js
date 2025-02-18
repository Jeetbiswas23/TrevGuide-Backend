import express from 'express';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new blog
router.post('/', auth, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.userId
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comments route
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      blog: req.params.id,
      author: req.userId
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get blog comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
