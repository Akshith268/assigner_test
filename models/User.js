const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
