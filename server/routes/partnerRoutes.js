const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPartnerLogoMiddleware } = require('../middleware/uploadMiddleware');
const {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  updatePartnerOrder,
  getActivePartners
} = require('../controllers/partnerController');

// Public routes
router.get('/', getAllPartners);
router.get('/active', getActivePartners);
router.get('/:id', getPartnerById);

// Protected routes
router.post('/', protect, admin, uploadPartnerLogoMiddleware, createPartner);
router.put('/:id', protect, admin, uploadPartnerLogoMiddleware, updatePartner);
router.delete('/:id', protect, admin, deletePartner);
router.put('/order', protect, admin, updatePartnerOrder);

module.exports = router;