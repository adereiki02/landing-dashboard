const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories,
  getHighlightedNews
} = require('../controllers/newsController');

// Public routes
router.get('/', getAllNews);
router.get('/categories', getNewsCategories);
router.get('/highlighted', getHighlightedNews);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id', getNewsById);

// Protected routes
router.post('/', protect, createNews);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;