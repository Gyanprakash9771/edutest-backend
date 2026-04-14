const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// 🔥 SAVE PROGRESS
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
      });
    }

    // ✅ add if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // ✅ update last watched
    progress.lastLesson = lessonId;

    await progress.save();

    res.json(progress);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔥 GET PROGRESS
router.get("/:userId/:courseId", async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.params.userId,
      courseId: req.params.courseId,
    });

    res.json(progress || {});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;