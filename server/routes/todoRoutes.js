const express = require('express');
const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes below with JWT validation
router.use(authController.verifyToken);

// Route to get all tasks
router.get('/', todoController.getTasks);

// Route to add a new task
router.post('/', todoController.addTask);

// Route to update a task status
router.put('/:id', todoController.updateTask);

// Route to delete a task
router.delete('/:id', todoController.deleteTask);

router.get('/:id', todoController.getOneTask);

module.exports = router;
