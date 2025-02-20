const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  progress: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
