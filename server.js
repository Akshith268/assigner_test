const express = require("express");
const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
const app = express();
app.use(express.json());

// ✅ Define Validation Schema using Joi
const userSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  age: Joi.number().greater(18).required(),
});

// ✅ POST /createUser - Validate & Sanitize Input
app.post("/createUser", (req, res) => {
  const { error, value } = userSchema.validate(req.body, { escapeHtml: true });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  res.json({ message: "User created successfully", data: value });
});

// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
