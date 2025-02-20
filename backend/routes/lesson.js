const express = require("express");
const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const router = express.Router();

// Get a lesson by ID, including its associated quizzes
router.get("/lesson/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  try {
    // Find the lesson by ID and populate the quizzes field with associated quizzes
    const lesson = await Lesson.findById(lessonId).populate("quizzes");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Return the lesson along with its quizzes
    res.status(200).json({
      title: lesson.title,
      content: lesson.content,
      subject: lesson.subject,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      quizzes: lesson.quizzes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the lesson" });
  }
});

// Route to lock the quiz
router.get("/quiz/:quizId/lock", async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.locked === true) {
      return res.status(400).json({ message: "Quiz is already locked" });
    }

    quiz.locked = true;

    await quiz.save();

    return res.status(200).json({ message: "Quiz successfully locked", quiz });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Get quizzes associated with a lesson by lesson ID
router.get("/:lessonId/quizzes", async (req, res) => {
  const { lessonId } = req.params;

  try {
    const quizzes = await Quiz.find({ lesson: lessonId })
      .populate("questions")
      .exec();

    const lesson = await Lesson.findById(lessonId);

    if (quizzes.length === 0) {
      return res.status(200).json({ quizzes: [] });
    }

    res.status(200).json({
      quizzes: quizzes.map((quiz) => ({
        lesson: lesson,
        quizId: quiz._id,
        totalQuestions: quiz.totalQuestions,
        passingScore: quiz.passingScore,
        completed: quiz.completed,
        pointsEarned: quiz.pointsEarned,
        locked: quiz.locked,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving quizzes for the lesson",
    });
  }
});

// Get questions associated with a quiz by quiz ID
router.get("/:quizId/questions", async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // If no questions are found, return an empty array
    if (quiz.questions.length === 0) {
      return res.status(200).json({ questions: [] });
    }

    res.status(200).json({
      questions: quiz.questions.map((question) => ({
        questionId: question._id,
        questionText: question.questionText,
        answerChoices: question.answerChoices,
        correctAnswers: question.correctAnswers,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving questions for the quiz",
    });
  }
});

// Get lessons by user id
router.get("/lessons/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const lessons = await Lesson.find({ user: userId });

    if (!lessons || lessons.length === 0) {
      return res
        .status(404)
        .json({ message: "No lessons found for this user" });
    }

    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/quiz/:quizId/points", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { points } = req.body;

    if (typeof points !== "number" || points < 0) {
      return res.status(400).json({ message: "Invalid pointsEarned value" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.pointsEarned = points;

    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
