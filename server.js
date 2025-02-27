const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");

const app = express();

// ✅ Multer setup (stores files temporarily in 'uploads/' directory)
const upload = multer({ dest: "uploads/" });

// ✅ POST /upload - Upload and process CSV
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const results = [];

  // Read and process CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      fs.unlinkSync(filePath); // Delete file after processing

      if (results.length === 0) {
        return res.status(400).json({ message: "Empty CSV file" });
      }

      res.json({
        message: "File processed successfully",
        numRows: results.length,
        numCols: Object.keys(results[0]).length,
        sampleData: results.slice(0, 5), // Return first 5 rows
      });
    })
    .on("error", (err) => {
      res.status(500).json({ message: "Error processing file", error: err.message });
    });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
