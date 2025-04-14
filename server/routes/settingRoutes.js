const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getSettings,
  updateSettings
} = require('../controllers/settingController');

// Public routes
router.get('/', getSettings);

// Protected routes
router.put('/', protect, admin, updateSettings);

module.exports = router;