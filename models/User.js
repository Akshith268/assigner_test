const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store plain text password
  role: { type: String, enum: ["admin", "user"], default: "user" }
});

module.exports = mongoose.model("User", UserSchema);
