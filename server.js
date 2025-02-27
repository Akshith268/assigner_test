const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const transactionRoutes = require("./routes/transaction");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api", transactionRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
