const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
    },
    siteDescription: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    socialMedia: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },
    metaTags: {
      type: String,
      trim: true,
    },
    googleAnalyticsId: {
      type: String,
      trim: true,
    },
    customCss: {
      type: String,
      trim: true,
    },
    customJs: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);