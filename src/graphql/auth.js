const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = { createToken };