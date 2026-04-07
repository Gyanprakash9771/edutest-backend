const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const multer = require("multer");

// ✅ ADD THIS (fix CORS preflight)
router.options("/", (req, res) => {
  res.sendStatus(200);
});

// Image upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ADD COURSE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    let whatYouWillLearn = [];
    let courseContent = [];


    // ✅ SAFE PARSE + DEBUG
    try {
      if (req.body.whatYouWillLearn) {
        console.log("RAW learn:", req.body.whatYouWillLearn);
        whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      }
    } catch (e) {
      console.log("❌ Learn parse error:", e.message);
    }

    try {
      if (req.body.courseContent) {
        console.log("RAW content:", req.body.courseContent);
        courseContent = JSON.parse(req.body.courseContent);
      }
    } catch (e) {
      console.log("❌ Content parse error:", e.message);
    }

    // ✅ DEBUG FINAL DATA
    console.log("FINAL DATA:", { whatYouWillLearn, courseContent });

    const course = new Course({
      title: req.body.title,
      lessons: Number(req.body.lessons),
      category: req.body.category,
      level: req.body.level,
      image: req.file ? req.file.filename : null,

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
  const courses = await Course.find();
  res.json(courses);
});

// GET SINGLE COURSE
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE COURSE
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE COURSE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("UPDATE HIT:", req.params.id);

    let whatYouWillLearn = [];
    let courseContent = [];

    try {
      if (req.body.whatYouWillLearn) {
        console.log("RAW learn:", req.body.whatYouWillLearn);
        whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      }
    } catch (e) {
      console.log("❌ Learn parse error:", e.message);
    }

    try {
      if (req.body.courseContent) {
        console.log("RAW content:", req.body.courseContent);
        courseContent = JSON.parse(req.body.courseContent);
      }
    } catch (e) {
      console.log("❌ Content parse error:", e.message);
    }

    console.log("FINAL UPDATE DATA:", { whatYouWillLearn, courseContent });

    const updatedData = {
      title: req.body.title,
      lessons: Number(req.body.lessons),
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

    if (req.file) {
      updatedData.image = req.file.filename;
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