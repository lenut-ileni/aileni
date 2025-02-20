const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  minPoints: { type: Number, required: true },
  maxPoints: { type: Number, required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  levelNumber: { type: Number, required: true },
});

const Level = mongoose.model("Level", levelSchema);

module.exports = Level;
