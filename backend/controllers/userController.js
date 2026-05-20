const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  // 1. Validation: Check if fields are empty
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // 2. Check if user exists
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3. Create User
  const user = await User.create({
    name,
    email: normalizedEmail,
    password, // This will be hashed automatically by our Model middleware!
    role:
      normalizedEmail === "admin@ejja.com" ? "admin" : req.body.role || "user",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Authenticate a user
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  // Check for user email
  const user = await User.findOne({ email: normalizedEmail });

  // Compare password using our custom Model method 'matchPassword'
  if (user && (await user.matchPassword(password))) {
    // Force admin role if email matches (case-insensitive)
    if (normalizedEmail === "admin@ejja.com" && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// Generate JWT Token
const getAdminStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({});
  const productCount = await Product.countDocuments({});
  const orders = await Order.find({});

  const totalRevenue = orders.reduce((acc, order) => {
    return acc + (order.isPaid ? order.totalPrice : 0);
  }, 0);

  const orderCount = orders.length;

  res.json({
    userCount,
    productCount,
    orderCount,
    totalRevenue,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getAdminStats,
};
