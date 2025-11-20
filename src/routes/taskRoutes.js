const express = require('express');
const {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTaskStatus);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
