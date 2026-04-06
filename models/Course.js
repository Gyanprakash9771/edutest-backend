const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  lessons: Number,
  category: String,
  level: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);