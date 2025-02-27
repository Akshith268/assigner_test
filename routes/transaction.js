const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// ✅ POST /addUser - Create a New User
router.post("/addUser", async (req, res) => {
  const { username, balance } = req.body;

  if (!username || balance === undefined || balance < 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const newUser = new User({ username, balance });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// ✅ POST /transaction - Money Transfer
router.post("/transaction", async (req, res) => {
  const { sender_id, receiver_id, amount } = req.body;

  if (!sender_id || !receiver_id || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(sender_id).session(session);
    const receiver = await User.findById(receiver_id).session(session);

    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Transaction successful", sender, receiver });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Transaction failed", error: error.message });
  }
});

module.exports = router;
