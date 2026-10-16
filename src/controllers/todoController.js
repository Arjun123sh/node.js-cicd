const todoModel = require('../models/todoModel');

const todoController = {
  // GET /api/todos - Get list of todos with optional filtering
  getAllTodos: (req, res) => {
    try {
      const { completed, search, priority } = req.query;
      const todos = todoModel.findAll({ completed, search, priority });
      res.status(200).json({
        success: true,
        count: todos.length,
        data: todos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve todos'
      });
    }
  },

  // GET /api/todos/:id - Get single todo by ID
  getTodoById: (req, res) => {
    try {
      const { id } = req.params;
      const todo = todoModel.findById(id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve todo'
      });
    }
  },

  // POST /api/todos - Create a new todo
  createTodo: (req, res) => {
    try {
      const { title, description, priority, dueDate } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Field "title" is required and must be a non-empty string'
        });
      }

      const newTodo = todoModel.create({ title, description, priority, dueDate });
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create todo'
      });
    }
  },

  // PUT /api/todos/:id - Replace or update all fields of a todo
  updateTodo: (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, completed, priority, dueDate } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Field "title" is required for full update'
        });
      }

      const updatedTodo = todoModel.update(id, {
        title,
        description,
        completed,
        priority,
        dueDate
      });

      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update todo'
      });
    }
  },

  // PATCH /api/todos/:id - Partially update a todo (e.g., mark completed)
  patchTodo: (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one field must be provided to update'
        });
      }

      if (updates.title !== undefined && (typeof updates.title !== 'string' || !updates.title.trim())) {
        return res.status(400).json({
          success: false,
          error: 'Field "title" cannot be empty'
        });
      }

      const updatedTodo = todoModel.update(id, updates);

      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update todo'
      });
    }
  },

  // DELETE /api/todos/:id - Delete todo by ID
  deleteTodo: (req, res) => {
    try {
      const { id } = req.params;
      const deleted = todoModel.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: `Todo with ID '${id}' not found`
        });
      }

      res.status(200).json({
        success: true,
        message: `Todo with ID '${id}' deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete todo'
      });
    }
  },

  // DELETE /api/todos - Delete all completed todos
  clearCompletedTodos: (req, res) => {
    try {
      const count = todoModel.deleteCompleted();
      res.status(200).json({
        success: true,
        message: `Cleared ${count} completed todo(s)`,
        deletedCount: count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to clear completed todos'
      });
    }
  }
};

module.exports = todoController;
