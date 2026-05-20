const mongoose = require('mongoose');

// REVIEW SCHEMA: Sub-document for individual reviews
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    images: [{ // Array for multiple image support
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Mango', 'Citrus', 'Mixed', 'Garlic', 'Green Chilli']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    reviews: [reviewSchema], // Nested array of reviews
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0
    },
    countInStock: {
        type: Number,
        required: [true, 'Please add stock count'],
        default: 0
    },
    spiceLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
