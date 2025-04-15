const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'News slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'News content is required'],
      minlength: [20, 'Content must be at least 20 characters long']
    },
    excerpt: {
      type: String,
      required: [true, 'News excerpt is required'],
      maxlength: 300,
    },
    featuredImage: {
      type: String,
      default: '/uploads/default-news.jpg', // Default image jika tidak ada upload
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 20
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Validasi khusus untuk tags
newsSchema.path('tags').validate(function(tags) {
  return tags.length <= 5; // Maksimal 5 tags
}, 'Maximum 5 tags allowed');

// Create a text index for search functionality
newsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

module.exports = mongoose.model('News', newsSchema);