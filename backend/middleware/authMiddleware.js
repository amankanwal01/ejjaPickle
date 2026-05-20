const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * PROTECT MIDDLEWARE:
 * This checks if a valid JWT token exists in the request headers.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format is: Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from token (exclude password) and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * ADMIN MIDDLEWARE:
 * This checks if the attached user has the 'admin' role.
 * Special case: admin@ejja.com is always treated as an admin.
 */
const admin = (req, res, next) => {
  // 1. Log the user attempt (Internal only, won't show to user but good practice)
  const isAdminRole = req.user && req.user.role === "admin";
  const isMasterAdmin =
    req.user &&
    req.user.email &&
    req.user.email.toLowerCase() === "admin@ejja.com";

  if (req.user && (isAdminRole || isMasterAdmin)) {
    // If master admin but role is not admin in DB, upgrade it for future consistency
    if (isMasterAdmin && !isAdminRole) {
      req.user.role = "admin";
      req.user
        .save()
        .catch((err) => console.error("Auto-upgrade failed:", err));
    }
    next();
  } else {
    res.status(403);
    // Be explicit about why it failed
    const msg = req.user
      ? `User ${req.user.email} with role ${req.user.role} is not authorized`
      : "User not found in request";
    throw new Error(msg);
  }
};

module.exports = { protect, admin };
