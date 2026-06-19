const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  getAdminStats,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/stats", protect, admin, getAdminStats);

router.post("/", registerUser);
router.post("/login", loginUser);

module.exports = router;
