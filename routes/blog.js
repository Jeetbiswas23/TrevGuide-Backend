import express from 'express';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

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
      .populate('likes', 'username')  // Add this line
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
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username');  // Add this line
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    console.log('Updating blog:', req.params.id, 'by user:', req.userId);
    console.log('Update data:', req.body);

    // Update the blog directly
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('author', 'username')
     .populate('likes', 'username');

    if (!updatedBlog) {
      console.log('Blog not found or user not authorized');
      return res.status(404).json({ 
        message: 'Blog not found or user not authorized to update this blog'
      });
    }

    console.log('Blog updated successfully:', updatedBlog);
    res.json(updatedBlog);

  } catch (error) {
    console.error('Update blog error:', error);
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

// Add like/unlike route
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.userId);
    if (likeIndex === -1) {
      blog.likes.push(req.userId);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
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
