const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pointsAwarded: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  earnedAt: { type: Date, default: Date.now },
});

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
