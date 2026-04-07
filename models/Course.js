const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  lessons: Number,
  category: String,
  level: String,
  image: String,

  // ✅ ADDED FIELDS (nothing else changed)
  description: String,
  instructor: String,
  duration: String,
  enrolled: Number,
  language: String,
  price: String,

  whatYouWillLearn: [String],

  courseContent: [
    {
      sectionTitle: String,
      lectures: [
        {
          title: String,
          duration: String
        }
      ]
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);