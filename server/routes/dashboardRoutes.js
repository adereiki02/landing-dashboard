const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController.js');

// Protected routes - only accessible to admins
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;