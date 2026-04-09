const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD category
router.post("/", async (req, res) => {
  try {
    const { name, parent } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCat = new Category({
      name,
      parent: parent || null,
    });

    await newCat.save();
    res.json(newCat);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;