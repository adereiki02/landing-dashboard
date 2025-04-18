const express = require('express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const config = require('../config/config');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const newsRoutes = require('./newsRoutes');
const partnerRoutes = require('./partnerRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const settingRoutes = require('./settingRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
    },
    servers: [
      {
        url: config.backendUrl,
        description: `API Server (${config.nodeEnv})`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Path to the API docs - include all route files
  apis: [
    path.resolve(__dirname, '*.js')
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     description: A simple test endpoint to verify Swagger is working
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Swagger UI route
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 *   - name: Auth
 *     description: Authentication
 *   - name: News
 *     description: News management
 *   - name: Partners
 *     description: Partner management
 *   - name: Portfolio
 *     description: Portfolio management
 *   - name: Settings
 *     description: Application settings
 *   - name: Dashboard
 *     description: Dashboard data
 */

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

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

module.exports = router;
module.exports.swaggerSpec = swaggerSpec;