const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// User Profile (Accessible to all authenticated users)
router.get("/user/profile", authenticate, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

// Admin Dashboard (Only for Admins)
router.get("/admin/dashboard", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard", user: req.user });
});

module.exports = router;
