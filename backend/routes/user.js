const express = require("express");
const User = require("../models/User");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Level = require("../models/Level");
const router = express.Router();

// Get user data by userId endpoint
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by userId and populate lessons, quizzes, and level
    const user = await User.findById(userId)
      .populate({
        path: "lessons",
        select: "title subject",
      })
      .populate({
        path: "quizzes",
        select: "locked pointsEarned",
        populate: {
          path: "lesson",
          select: "title subject",
        },
      })
      .populate({
        path: "level",
        select: "name description minPoints maxPoints levelNumber", // Only return the necessary fields of the level
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      userId: user._id,
      email: user.email,
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const getLevelByPoints = async (totalPoints) => {
  const level = await Level.findOne({
    minPoints: { $lte: totalPoints },
    maxPoints: { $gte: totalPoints },
  }).sort({ minPoints: 1 });
  return level;
};

// Route to update total points and level
router.put("/user/:userId/points", async (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.totalPoints += points;

    const newLevel = await getLevelByPoints(user.totalPoints);

    if (newLevel) {
      user.level = newLevel._id; // Update the user's level with the new level
    }

    await user.save();

    res.json({
      message: "User's total points updated successfully",
      userId: user._id,
      totalPoints: user.totalPoints,
      level: newLevel.name,
      levelNumber: newLevel.levelNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
