const mongoose = require("mongoose");
const Level = require("../models/Level");
require("dotenv").config();

const seedLevels = async () => {
  const levels = [
    {
      name: "Beginner",
      description: "Get started with the platform and complete basic lessons.",
      minPoints: 0,
      maxPoints: 300,
      levelNumber: 1,
    },
    {
      name: "Novice",
      description: "Start solving interactive quizzes and challenges.",
      minPoints: 301,
      maxPoints: 600,
      levelNumber: 2,
    },
    {
      name: "Learner",
      description: "Dive deeper into topics with more complex exercises.",
      minPoints: 601,
      maxPoints: 1000,
      levelNumber: 3,
    },
    {
      name: "Student",
      description: "Begin applying knowledge to small projects.",
      minPoints: 1001,
      maxPoints: 1500,
      levelNumber: 4,
    },
    {
      name: "Intermediate",
      description: "Strengthen skills through more challenging lessons.",
      minPoints: 1501,
      maxPoints: 2000,
      levelNumber: 5,
    },
    {
      name: "Skilled",
      description: "Tackle complex themes and real-world problems.",
      minPoints: 2001,
      maxPoints: 2500,
      levelNumber: 6,
    },
    {
      name: "Advanced",
      description: "Become proficient by solving real-world use cases.",
      minPoints: 2501,
      maxPoints: 3000,
      levelNumber: 7,
    },
    {
      name: "Expert",
      description: "Demonstrate high-level mastery and application.",
      minPoints: 3001,
      maxPoints: 4000,
      levelNumber: 8,
    },
    {
      name: "Master",
      description: "Exhibit expertise by contributing to the community.",
      minPoints: 4001,
      maxPoints: 5000,
      levelNumber: 9,
    },
    {
      name: "Grandmaster",
      description: "Top-tier users who have made exceptional contributions.",
      minPoints: 5001,
      maxPoints: 6000,
      levelNumber: 10,
    },
    {
      name: "Sage",
      description: "Mentors who guide others and contribute knowledge.",
      minPoints: 6001,
      maxPoints: 7000,
      levelNumber: 11,
    },
    {
      name: "Legend",
      description:
        "The highest level of recognition for continuous excellence.",
      minPoints: 7001,
      maxPoints: 10000,
      levelNumber: 12,
    },
  ];

  try {
    // Remove all levels before seeding new data to avoid duplicates
    await Level.deleteMany({});
    console.log("Existing levels cleared.");

    // Insert levels into the database
    const createdLevels = await Level.insertMany(levels);
    console.log(`Created ${createdLevels.length} levels.`);
  } catch (error) {
    console.error("Error seeding levels:", error);
  }
};

async function seedAndDisconnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    await seedLevels();

    console.log("Seeding completed, disconnecting...");
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seedAndDisconnect();
