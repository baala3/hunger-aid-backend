const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.headers["authentication"];

  if (!token) {
    return res.status(403).json("No token provided");
  }

  try {
    const user = await jwt.verify(token, process.env.JWT_SCERET_KEY);
    req.auth = user;
    next();
  } catch (err) {
    res.status(500).json("invalid token");
  }
}
module.exports = auth;
