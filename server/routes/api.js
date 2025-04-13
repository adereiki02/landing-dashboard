const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

// User routes
router.use('/users', userRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Add other routes here

module.exports = router;