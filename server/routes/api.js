const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const newsRoutes = require('./newsRoutes');
const partnerRoutes = require('./partnerRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const settingRoutes = require('./settingRoutes');

// User routes
router.use('/users', userRoutes);

// Auth routes
router.use('/auth', authRoutes);

// News routes
router.use('/news', newsRoutes);

// Partner routes
router.use('/partners', partnerRoutes);

// Portfolio routes
router.use('/portfolio', portfolioRoutes);

// Settings routes
router.use('/settings', settingRoutes);

module.exports = router;