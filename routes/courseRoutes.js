const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson"); // 🔥 ADD THIS
const multer = require("multer");


router.options("/", (req, res) => {
  res.sendStatus(200);
});


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.post("/", upload.any(), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    let whatYouWillLearn = [];
    let courseContent = [];

    try {
      if (req.body.whatYouWillLearn) {
        whatYouWillLearn =
          typeof req.body.whatYouWillLearn === "string"
            ? JSON.parse(req.body.whatYouWillLearn)
            : req.body.whatYouWillLearn;
      }
    } catch (e) {
      console.log("❌ Learn parse error:", e.message);
      whatYouWillLearn = [];
    }

    try {
      if (req.body.courseContent) {
        courseContent =
          typeof req.body.courseContent === "string"
            ? JSON.parse(req.body.courseContent)
            : req.body.courseContent;
      }
    } catch (e) {
      console.log("❌ Content parse error:", e.message);
      courseContent = [];
    }

    const totalLessons = courseContent.reduce((acc, section) => {
      return acc + (section.lectures?.length || 0);
    }, 0);

    const course = new Course({
      title: req.body.title,
      lessons: totalLessons,
      category: req.body.category,
      level: req.body.level,
      image: req.files?.[0]?.filename || null,

      description: req.body.description,
      instructor: req.body.instructor,
      duration: req.body.duration,
      enrolled: Number(req.body.enrolled),
      language: req.body.language,
      price: req.body.price,
      whatYouWillLearn,
      courseContent,
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// GET ALL COURSES
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("category");

  const formatted = courses.map((course) => ({
    ...course.toObject(),
    thumbnail: course.image || "",
    totalLessons: course.lessons || 0,
    students: course.enrolled || 0,
  }));

  res.json(formatted);
});


// ✅ GET SINGLE COURSE (🔥 VIDEO FIX HERE)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("category");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔥 FETCH ALL LESSONS OF SAME CATEGORY
    const lessons = await Lesson.find({ category: course.category });

    res.json({
      ...course._doc,
      learn: course.whatYouWillLearn || [],
      thumbnail: course.image || "",
      totalLessons: course.lessons || 0,
      students: course.enrolled || 0,

      // 🔥 FIXED SECTIONS WITH VIDEO
      sections: course.courseContent?.map((section) => ({
        title: section.sectionTitle,
        lessons: section.lectures?.map((lec) => {

          // 🔥 MATCH LESSON BY TITLE
          const matchedLesson = lessons.find(
            (l) => l.lectureTitle === lec.title
          );

          return {
            title: lec.title,
            time: lec.duration,
            type: "video",
            video: matchedLesson?.video || null, // ✅ VIDEO COMES HERE
          };
        }) || [],
      })) || [],
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


router.put("/:id", upload.any(), async (req, res) => {
  try {
    console.log("UPDATE HIT:", req.params.id);

    let whatYouWillLearn = [];
    let courseContent = [];

    try {
      if (req.body.whatYouWillLearn) {
        whatYouWillLearn =
          typeof req.body.whatYouWillLearn === "string"
            ? JSON.parse(req.body.whatYouWillLearn)
            : req.body.whatYouWillLearn;
      }
    } catch (e) {
      console.log("❌ Learn parse error:", e.message);
      whatYouWillLearn = [];
    }

    try {
      if (req.body.courseContent) {
        courseContent =
          typeof req.body.courseContent === "string"
            ? JSON.parse(req.body.courseContent)
            : req.body.courseContent;
      }
    } catch (e) {
      console.log("❌ Content parse error:", e.message);
      courseContent = [];
    }

    const totalLessons = courseContent.reduce((acc, section) => {
      return acc + (section.lectures?.length || 0);
    }, 0);

    const updatedData = {
      title: req.body.title,
      lessons: totalLessons,
      category: req.body.category,
      level: req.body.level,

      description: req.body.description,
      instructor: req.body.instructor,
      duration: req.body.duration,
      enrolled: Number(req.body.enrolled),
      language: req.body.language,
      price: req.body.price,
      whatYouWillLearn,
      courseContent,
    };

    if (req.files?.[0]) {
      updatedData.image = req.files[0].filename;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;