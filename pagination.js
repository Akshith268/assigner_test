require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Mongoose Model
const Item = mongoose.model("Item", new mongoose.Schema({
  name: String,
  price: Number,
}));

// Insert Sample Data (Run this only once if the database is empty)
// const insertSampleData = async () => {
//   const count = await Item.countDocuments();
//   if (count === 0) {
//     await Item.insertMany([
//       { name: "Item A", price: 30 },
//       { name: "Item B", price: 20 },
//       { name: "Item C", price: 50 },
//       { name: "Item D", price: 40 }
//     ]);
//     console.log("Sample data inserted!");
//   }
// };
// insertSampleData();

// GET /items - Fetch Paginated & Sorted Items from MongoDB
app.get("/items", async (req, res) => {
    let { page = 1, limit = 2, sort_by = "id", sort_order = "asc" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
  
    // Log the received query parameters for debugging
    console.log("Query params:", { page, limit, sort_by, sort_order });
  
    try {
      // Explicitly determine sort direction
      const sortDirection = sort_order.toLowerCase() === "asc" ? 1 : -1;
      console.log("Sorting by:", sort_by, "Direction:", sortDirection);

      let items = await Item.find()
        .sort({ [sort_by]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({ page, limit, total: await Item.countDocuments(), data: items });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
