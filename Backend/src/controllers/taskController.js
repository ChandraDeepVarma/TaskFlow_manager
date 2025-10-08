import Task from "../models/Task.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
