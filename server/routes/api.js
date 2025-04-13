const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

// User routes
router.use('/users', userRoutes);

// Add other routes here

module.exports = router;