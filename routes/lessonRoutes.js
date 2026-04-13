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

// ✅ UPDATE LESSON
router.put("/:id", async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("category");

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ message: "Error updating lesson" });
  }
});


// ✅ DELETE LESSON
router.delete("/:id", async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lesson" });
  }
});

module.exports = router;