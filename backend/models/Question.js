const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  answerChoices: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
  points: { type: Number, default: 1 },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
