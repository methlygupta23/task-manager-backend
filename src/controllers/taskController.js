const Task = require('../models/Task');

const formatTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  createdAt: task.createdAt,
});

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks.map(formatTask));
  } catch (error) {
    console.error('Error fetching tasks', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
    });

    res.status(201).json(formatTask(task));
  } catch (error) {
    console.error('Error creating task', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(formatTask(task));
  } catch (error) {
    console.error('Error updating task', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Task.destroy({ where: { id } });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
};
