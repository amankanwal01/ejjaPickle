const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

// Define Routes
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.array("images", 5), createProduct); // Support up to 5 images

router.route("/:id").get(getProductById).put(protect, admin, updateProduct); // Only admin can edit

router.route("/:id/reviews").post(protect, createProductReview); // Any user can review

module.exports = router;
