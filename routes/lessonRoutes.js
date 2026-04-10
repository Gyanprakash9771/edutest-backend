const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");



router.post("/", async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error adding lesson" });
  }
});



router.get("/", async (req, res) => {
  try {
    const { category, course } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (course) filter.course = course;

    const lessons = await Lesson.find(filter)
      .populate("category")
      .populate("course");

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lessons" });
  }
});

module.exports = router;