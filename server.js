const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

// ✅ ADD THIS
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// ✅ PROPER CORS FIX (FINAL CLEAN VERSION)
const cors = require("cors");
app.use(cors());

// ✅ ADD THIS (CRITICAL FIX)
app.disable("etag");

// cache fix
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ ADD THIS (NEW CATEGORY ROUTE)
app.use("/api/categories", categoryRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ FIXED: dynamic PORT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});