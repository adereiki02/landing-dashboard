const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add a question'],
      trim: true,
      maxlength: [200, 'Question cannot be more than 200 characters']
    },
    answer: {
      type: String,
      required: [true, 'Please add an answer'],
      trim: true,
      maxlength: [1000, 'Answer cannot be more than 1000 characters']
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Faq', FaqSchema);