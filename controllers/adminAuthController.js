const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ ADMIN SIGNUP
exports.adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json("Admin already exists");

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashed,
    });

    await admin.save();

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json("Admin not found");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
};