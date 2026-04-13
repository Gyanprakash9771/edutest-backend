const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  lessons: Number,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  level: String,
  image: String,

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
          lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
          },
          title: String,
          duration: String,

          // 🔥 ADD THIS
          video: String
        }
      ]
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);