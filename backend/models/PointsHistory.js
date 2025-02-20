const mongoose = require("mongoose");

const pointsHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  activityType: { type: String, required: true },
  activityDetails: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const PointsHistory = mongoose.model("PointsHistory", pointsHistorySchema);

module.exports = PointsHistory;
