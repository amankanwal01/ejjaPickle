const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please add a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discount: {
        type: Number,
        required: [true, 'Please add a discount value'],
        min: 0,
        max: 100 // Percentage
    },
    expiry: {
        type: Date,
        required: [true, 'Please add an expiry date']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
