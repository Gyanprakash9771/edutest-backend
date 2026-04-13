const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
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


// ================= CREATE COURSE =================
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
    } catch {
      whatYouWillLearn = [];
    }

    try {
      if (req.body.courseContent) {
        courseContent =
          typeof req.body.courseContent === "string"
            ? JSON.parse(req.body.courseContent)
            : req.body.courseContent;
      }
    } catch {
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


// ================= GET ALL =================
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


// ================= GET SINGLE (🔥 FIXED HERE) =================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("category");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lessons = await Lesson.find();

    res.json({
      ...course._doc,
      learn: course.whatYouWillLearn || [],
      thumbnail: course.image || "",
      totalLessons: course.lessons || 0,
      students: course.enrolled || 0,

      sections: course.courseContent?.map((section) => ({
        title: section.sectionTitle,
        lessons: section.lectures?.map((lec) => {

          // 🔥 DEBUG (you can remove later)
          console.log("COURSE TITLE:", lec.title);
          console.log("LESSONS:", lessons.map(l => l.lectureTitle));

          // 🔥 FIX (IMPORTANT CHANGE)
          const matchedLesson = lessons.find(
            (l) =>
              l.lectureTitle?.trim().toLowerCase().includes(
                lec.title?.trim().toLowerCase()
              )
          );

          return {
            title: lec.title,
            time: lec.duration,
            type: "video",
            video: matchedLesson?.video || null,
          };
        }) || [],
      })) || [],
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


// ================= UPDATE =================
router.put("/:id", upload.any(), async (req, res) => {
  try {
    let whatYouWillLearn = [];
    let courseContent = [];

    try {
      if (req.body.whatYouWillLearn) {
        whatYouWillLearn =
          typeof req.body.whatYouWillLearn === "string"
            ? JSON.parse(req.body.whatYouWillLearn)
            : req.body.whatYouWillLearn;
      }
    } catch {
      whatYouWillLearn = [];
    }

    try {
      if (req.body.courseContent) {
        courseContent =
          typeof req.body.courseContent === "string"
            ? JSON.parse(req.body.courseContent)
            : req.body.courseContent;
      }
    } catch {
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

    res.json(updatedCourse);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;