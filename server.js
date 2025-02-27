const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("./rate_limiting.js"); // Import middleware

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter); // Apply rate limiter

// Sample Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
