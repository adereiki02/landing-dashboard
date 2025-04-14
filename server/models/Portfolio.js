const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Portfolio slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Portfolio description is required'],
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      trim: true,
    },
    technologies: [{
      type: String,
      trim: true,
    }],
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    images: [{
      type: String,
    }],
    websiteUrl: {
      type: String,
      trim: true,
    },
    completionDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);