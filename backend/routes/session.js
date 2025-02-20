const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Level = require("../models/Level");
const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  console.log(email);
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      message: "Email, password, first name, and last name are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const firstLevel = await Level.findOne({ levelNumber: 1 });

  // If the first level doesn't exist, you can handle the error here
  if (!firstLevel) {
    return res.status(400).json({ message: "First level not found!" });
  }

  // Create new user with additional fields and defaults
  const newUser = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    totalPoints: 0,
    level: firstLevel._id,
    progress: 0,
    badges: [],
    achievements: [],
    lessons: [],
    quizzes: [],
  });

  await newUser.save();
  res
    .status(201)
    .json({ message: "User registered successfully", userId: newUser._id });
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("BEFORE USER");
  const user = await User.findOne({ email });
  console.log("AFTER USER");
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  console.log("AFTER USER fetch before match");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log(isMatch);

  // Generate JWT token
  const token = jwt.sign(
    { email: user.email, userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  // Send both token and userId in the response
  res.json({
    message: "Login successful",
    token,
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    totalPoints: user.totalPoints,
    level: user.level,
    progress: user.progress,
    badges: user.badges,
    achievements: user.achievements,
    lessons: user.lessons,
    quizzes: user.quizzes,
  });
});

module.exports = router;
