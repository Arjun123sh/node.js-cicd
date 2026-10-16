const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Routes mapped to /api/todos
router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.delete('/', todoController.clearCompletedTodos);

router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.patch('/:id', todoController.patchTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
