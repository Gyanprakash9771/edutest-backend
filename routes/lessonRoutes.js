const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");


// ✅ ADD LESSON
router.post("/", async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error adding lesson" });
  }
});


// ✅ GET LESSONS (FILTER BY CATEGORY ONLY)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const lessons = await Lesson.find(filter)
      .populate("category");

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lessons" });
  }
});

module.exports = router;