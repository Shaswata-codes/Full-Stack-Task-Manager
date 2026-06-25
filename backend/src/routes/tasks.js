const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// All routes in this file are protected by auth middleware
router.use(auth);

// @route   POST /api/v1/tasks
// @desc    Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const newTask = new Task({
      title,
      description,
      priority: priority || "Medium",
      dueDate: dueDate || null,
      completed: completed || false,
      owner: req.user.id, // from auth middleware
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task." });
  }
});

// @route   GET /api/v1/tasks
// @desc    Fetch all tasks of logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks." });
  }
});

// @route   DELETE /api/v1/tasks/completed
// @desc    Delete all completed tasks of logged-in user
// Note: Registered before GET /:id and DELETE /:id to prevent route param hijacking
router.delete("/completed", async (req, res) => {
  try {
    const result = await Task.deleteMany({ owner: req.user.id, completed: true });
    res.json({ message: "Completed tasks deleted successfully.", count: result.deletedCount });
  } catch (error) {
    console.error("Delete completed tasks error:", error);
    res.status(500).json({ message: "Server error while deleting completed tasks." });
  }
});

// @route   GET /api/v1/tasks/:id
// @desc    Fetch single task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this task." });
    }

    res.json(task);
  } catch (error) {
    console.error("Fetch single task error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    res.status(500).json({ message: "Server error while fetching the task." });
  }
});

// @route   PUT /api/v1/tasks/:id
// @desc    Update a task (owner only)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task." });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    res.status(500).json({ message: "Server error while updating the task." });
  }
});

// @route   DELETE /api/v1/tasks/:id
// @desc    Delete single task (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task." });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    res.status(500).json({ message: "Server error while deleting the task." });
  }
});

module.exports = router;
