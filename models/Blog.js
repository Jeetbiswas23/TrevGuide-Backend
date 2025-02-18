import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  imageUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Add virtual for likes count
blogSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
