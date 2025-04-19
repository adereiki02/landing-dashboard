const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPortfolioImageMiddleware } = require('../middleware/uploadMiddleware');
const {
  getAllPortfolioItems,
  getPortfolioItemById,
  getPortfolioItemBySlug,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePortfolioItemOrder,
  getProjectTypes,
  getFeaturedPortfolioItems
} = require('../controllers/portfolioController');

// Public routes
router.get('/', getAllPortfolioItems);
router.get('/project-types', getProjectTypes);
router.get('/featured', getFeaturedPortfolioItems);
router.get('/slug/:slug', getPortfolioItemBySlug);
// This route should be last as it's a catch-all for IDs
// Add a validation to ensure id is a valid ObjectId format
router.get('/:id([0-9a-fA-F]{24})', getPortfolioItemById);

// Protected routes
router.post('/', protect, admin, uploadPortfolioImageMiddleware, createPortfolioItem);
router.put('/:id', protect, admin, uploadPortfolioImageMiddleware, updatePortfolioItem);
router.delete('/:id', protect, admin, deletePortfolioItem);
router.put('/order/update', protect, admin, updatePortfolioItemOrder);

module.exports = router;