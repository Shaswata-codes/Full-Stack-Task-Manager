const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const { validateTask } = require("../middleware/validate");

// All routes in this file are protected by auth middleware
router.use(auth);

// @route   POST /api/v1/tasks
// @desc    Create a new task
router.post("/", validateTask, async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

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
    next(error);
  }
});

// @route   GET /api/v1/tasks
// @desc    Fetch all tasks of logged-in user
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/v1/tasks/completed
// @desc    Delete all completed tasks of logged-in user
// Note: Registered before GET /:id and DELETE /:id to prevent route param hijacking
router.delete("/completed", async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ owner: req.user.id, completed: true });
    res.json({ message: "Completed tasks deleted successfully.", count: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/tasks/:id
// @desc    Fetch single task by ID
router.get("/:id", async (req, res, next) => {
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
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    next(error);
  }
});

// @route   PUT /api/v1/tasks/:id
// @desc    Update a task (owner only)
router.put("/:id", validateTask, async (req, res, next) => {
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
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    next(error);
  }
});

// @route   DELETE /api/v1/tasks/:id
// @desc    Delete single task (owner only)
router.delete("/:id", async (req, res, next) => {
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
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found." });
    }
    next(error);
  }
});

module.exports = router;
