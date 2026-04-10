const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  lectureTitle: String,
  video: String,
  duration: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);