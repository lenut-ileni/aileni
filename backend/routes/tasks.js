const express = require("express");
const Task = require("../models/Task");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

const parseDate = (dateString) => {
  const [year, month, day] = dateString
    .split("-")
    .map((num) => parseInt(num, 10));
  return new Date(year, month - 1, day);
};

router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const { selectedDate, status } = req.query;

    if (!selectedDate) {
      return res.status(400).json({ message: "selectedDate is required" });
    }

    const selectedDateObj = parseDate(selectedDate);

    selectedDateObj.setHours(0, 0, 0, 0);

    // Prepare the filter for tasks
    const filter = {
      userId: req.userId,
      dueDate: { $gte: selectedDateObj },
    };

    // If 'status' is provided, filter by task completion status
    if (status !== undefined) {
      filter.completed = status === "true"; // Convert the status to boolean (true or false)
    }

    // Find tasks based on the filter
    const tasks = await Task.find(filter).sort({ dueDate: 1 }); // Sort tasks by due date in ascending order

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Create a new task
router.post("/tasks", verifyToken, async (req, res) => {
  const { title, dueDate, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Convert dueDate (string) to a Date object
  const parsedDueDate = dueDate ? parseDate(dueDate) : null;

  const newTask = new Task({
    title,
    userId: req.userId,
    dueDate: parsedDueDate,
    description,
  });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update an existing task
router.put("/tasks/:id", verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const { title, completed, dueDate, description } = req.body;

  const updatedFields = { title, completed, description };

  if (dueDate) {
    const parsedDueDate = parseDate(dueDate);
    updatedFields.dueDate = parsedDueDate;
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.userId },
      updatedFields,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Get a task by its ID
router.get("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

// Delete a task by its ID
router.delete("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
