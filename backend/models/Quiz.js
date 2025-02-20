const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  totalQuestions: { type: Number, required: true },
  passingScore: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  locked: { type: Boolean, default: false },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
