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
const upload = require('../middleware/uploadNews');

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news with pagination
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of news articles
 */
router.get('/', getAllNews);

/**
 * @swagger
 * /api/news/categories:
 *   get:
 *     summary: Get all news categories
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of news categories
 */
router.get('/categories', getNewsCategories);

/**
 * @swagger
 * /api/news/highlighted:
 *   get:
 *     summary: Get highlighted news
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: List of highlighted news
 */
router.get('/highlighted', getHighlightedNews);

/**
 * @swagger
 * /api/news/slug/{slug}:
 *   get:
 *     summary: Get news by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: News slug
 *     responses:
 *       200:
 *         description: News details
 *       404:
 *         description: News not found
 */
router.get('/slug/:slug', getNewsBySlug);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: News details
 *       404:
 *         description: News not found
 */
router.get('/:id', getNewsById);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               status:
 *                 type: string
 *               isHighlighted:
 *                 type: boolean
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', protect, upload.single('featuredImage'), createNews);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               status:
 *                 type: string
 *               isHighlighted:
 *                 type: boolean
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 */
router.put('/:id', protect, upload.single('featuredImage'), updateNews);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: News removed
 *       404:
 *         description: News not found
 */
router.delete('/:id', protect, deleteNews);

module.exports = router;