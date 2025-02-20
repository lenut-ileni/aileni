const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sessionRoutes = require("./routes/session");
const taskRoutes = require("./routes/tasks");
const aiRoutes = require("./routes/ai");
const lessonRoutes = require("./routes/lesson");
const userRoutes = require("./routes/user");

const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: "https://ai-leni-frontend-id5zqirjj-ilenuts-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Ensure MongoDB connects only once and reuses the connection
let isConnected = false;
async function connectDB() {
  console.log("connecting to db....");
  if (isConnected) {
    console.log("MongoDB connection already established.");
    return;
  }

  try {
    console.log("trying to connect");
    console.log(process.env.MONGODB_URI);
    console.log("trying to connect again");
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Use routes
app.use("/api", sessionRoutes);
app.use("/api", taskRoutes);
app.use("/api", aiRoutes);
app.use("/api", lessonRoutes);
app.use("/api", userRoutes);

app.get("/status", async (req, res) => {
  await connectDB();
  res.status(200).send("OK");
});

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
