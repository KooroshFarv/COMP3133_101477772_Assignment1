const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function getUserFromToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;

  const token = header.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user || null;
  } catch (err) {
    return null;
  }
}

module.exports = { getUserFromToken };