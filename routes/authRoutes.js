const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route - Register New User (No Hashing)
router.post("/signup", async (req, res) => {
    const { username, password, role } = req.body;

    const newUser = new User({
        username,
        password, // Store plain text password
        role
    });

    console.log("🔹 New User Created:", newUser);
    await newUser.save();
    res.json({ message: "User registered successfully" });
});

// Login Route - Authenticate User (No Hashing)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔹 Entered Username:", username);
    console.log("🔹 Entered Password:", password);

    // Check if user exists
    const user = await User.findOne({ username });
    console.log("🔹 Found User:", user);
    
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Direct Password Comparison
    if (password !== user.password) {
        console.log("🔹 Passwords do not match");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
