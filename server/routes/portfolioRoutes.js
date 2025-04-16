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
router.get('/:id', getPortfolioItemById);

// Protected routes
router.post('/', protect, admin, uploadPortfolioImageMiddleware, createPortfolioItem);
router.put('/:id', protect, admin, uploadPortfolioImageMiddleware, updatePortfolioItem);
router.delete('/:id', protect, admin, deletePortfolioItem);
router.put('/order/update', protect, admin, updatePortfolioItemOrder);

module.exports = router;