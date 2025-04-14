const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    icon: {
      type: String,
      default: 'default-service-icon.svg'
    },
    image: {
      type: String,
      default: 'default-service-image.jpg'
    },
    features: [{
      type: String,
      trim: true,
      maxlength: [200, 'Feature cannot be more than 200 characters']
    }],
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

module.exports = mongoose.model('Service', ServiceSchema);