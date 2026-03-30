const Task = require('../models/Task');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional()
});

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership or if it's admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Create a task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await Task.create({
      title: value.title,
      description: value.description,
      status: value.status || 'pending',
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
