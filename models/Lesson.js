const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  sectionTitle: String,

  lectureTitle: String,
  video: String,
  duration: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);