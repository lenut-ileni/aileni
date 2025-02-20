const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const bearerToken = token.split(" ")[1];

  if (!bearerToken) {
    return res.status(403).json({ message: "Invalid token format" });
  }

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  });
};

module.exports = verifyToken;
