const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expiry } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code,
        discount,
        expiry
    });

    res.status(201).json(coupon);
});

/**
 * @desc    Validate a coupon code
 * @route   POST /api/coupons/validate
 * @access  Private
 */
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid or inactive coupon code');
    }

    if (new Date(coupon.expiry) < new Date()) {
        res.status(400);
        throw new Error('Coupon has expired');
    }

    res.json({
        code: coupon.code,
        discount: coupon.discount
    });
});

module.exports = {
    createCoupon,
    validateCoupon
};
