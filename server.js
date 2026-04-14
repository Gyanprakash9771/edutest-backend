const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

const cors = require("cors");
app.use(cors());

app.disable("etag");

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.json());


const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});