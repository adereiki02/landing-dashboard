const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
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
router.get('/:id', getPortfolioItemById);

// Protected routes
router.post('/', protect, admin, createPortfolioItem);
router.put('/:id', protect, admin, updatePortfolioItem);
router.delete('/:id', protect, admin, deletePortfolioItem);
router.put('/order/update', protect, admin, updatePortfolioItemOrder);

module.exports = router;