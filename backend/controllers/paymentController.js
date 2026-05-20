const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/order
 * @access  Private
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // Amount in paise (e.g. 500.00 INR = 50000 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
        res.status(500);
        throw new Error('Order creation failed in Razorpay');
    }

    res.status(200).json(order);
});

/**
 * @desc    Verify Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is genuine
        const order = await Order.findById(order_id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'paid',
                update_time: Date.now().toString(),
            };
            await order.save();
            res.status(200).json({ status: "ok", message: "Payment Verified" });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } else {
        res.status(400);
        throw new Error('Invalid signature, payment could be tampered');
    }
});

module.exports = {
    createRazorpayOrder,
    verifyPayment
};
