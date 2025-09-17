// routes/importProducts.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {productsModel} = require('../models/Models')

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import-products", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use form-data with key 'file'" });
    }

    const data = fs.readFileSync(req.file.path, "utf-8");
    const products = JSON.parse(data);

    await productsModel.insertMany(products);
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Products imported successfully",
      importedCount: products.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;