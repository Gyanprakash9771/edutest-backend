const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    // ✅ allow only admin
    if (decoded.role !== "admin") {
      return res.status(403).json("Access denied");
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};