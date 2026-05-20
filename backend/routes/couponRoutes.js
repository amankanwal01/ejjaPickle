const express = require('express');
const router = express.Router();
const { createCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createCoupon);
router.post('/validate', protect, validateCoupon);

module.exports = router;
