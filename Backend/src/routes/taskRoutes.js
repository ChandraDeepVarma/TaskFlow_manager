// Importing required libraries
import express from "express";
import { v4 as uuidv4 } from "uuid"; // for unique IDs
import { authMiddleware } from "../middleware/authMiddleware.js"; // protect routes
import { allowRoles } from "../middleware/roleMiddleware.js";
import Task from "../models/taskModel.js"; // Sequelize Task model

const router = express.Router();

// In-memory database (array)
let tasks = [];

// =============================
// 1. GET all tasks (DB-driven)
// =============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch all tasks from the DB
    const dbTasks = await Task.findAll({
      order: [["createdAt", "ASC"]], // order by creation date
    });

    // Map DB tasks to in-memory format for consistency
    tasks = dbTasks.map((t) => ({
      id: uuidv4(), // in-memory unique ID
      task: t.task,
      completed: t.completed,
      dbId: t.id, // reference to DB ID
    }));

    res.json(tasks);
  } catch (err) {
    console.error("DB fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// =============================
// 2. POST (add a new task)
// =============================
router.post("/", authMiddleware, allowRoles("admin"), async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task text is required" });
  }

  try {
    // Save task to DB
    const dbTask = await Task.create({
      task: task,
      completed: "false",
    });

    const newTask = {
      id: uuidv4(),
      task: dbTask.task,
      completed: dbTask.completed,
      dbId: dbTask.id,
    };

    tasks.push(newTask);

    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    console.error("DB create error:", err.message);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// =============================
// 3. PUT (update a task by id)
// =============================
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    const dbId = tasks[taskIndex].dbId;
    const dbTask = await Task.findByPk(dbId);

    if (!dbTask) return res.status(404).json({ error: "DB task not found" });

    // ✅ User can ONLY mark task complete
    if (req.user.role === "user") {
      if (completed !== undefined) {
        tasks[taskIndex].completed = completed;
        dbTask.completed = completed;
      }
    }
    // ✅ Admin can edit text + status
    else if (req.user.role === "admin") {
      if (task !== undefined) {
        tasks[taskIndex].task = task;
        dbTask.task = task;
      }
      if (completed !== undefined) {
        tasks[taskIndex].completed = completed;
        dbTask.completed = completed;
      }
    }

    await dbTask.save();

    res.json({ message: "Task updated", task: tasks[taskIndex] });
  } catch (err) {
    console.error("DB update error:", err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// =============================
// 4. DELETE one task by id
// =============================
router.delete("/:id", authMiddleware, allowRoles("admin"), async (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    const dbId = tasks[taskIndex].dbId;
    const dbTask = await Task.findByPk(dbId);

    if (dbTask) await dbTask.destroy();

    const deletedTask = tasks.splice(taskIndex, 1);

    res.json({ message: "Task deleted", task: deletedTask[0] });
  } catch (err) {
    console.error("DB delete error:", err.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// =============================
// 5. DELETE all tasks
// =============================
router.delete("/", authMiddleware, allowRoles("admin"), async (req, res) => {
  try {
    await Task.destroy({ where: {} }); // delete all tasks in DB
    tasks = [];
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    console.error("DB delete all error:", err.message);
    res.status(500).json({ error: "Failed to delete all tasks" });
  }
});

export default router;
