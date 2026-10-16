const crypto = require('crypto');

// In-memory data store with initial sample tasks
let todos = [
  {
    id: crypto.randomUUID(),
    title: 'Learn Node.js and Express',
    description: 'Understand routing, middleware, and REST architecture.',
    completed: true,
    priority: 'high',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Build a Todo REST API',
    description: 'Implement CRUD endpoints with validation and error handling.',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const todoModel = {
  findAll: ({ completed, search, priority } = {}) => {
    let result = [...todos];

    if (completed !== undefined) {
      const isCompleted = completed === 'true' || completed === true;
      result = result.filter(todo => todo.completed === isCompleted);
    }

    if (priority) {
      result = result.filter(todo => todo.priority.toLowerCase() === priority.toLowerCase());
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        todo =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    return result;
  },

  findById: (id) => {
    return todos.find(todo => todo.id === id) || null;
  },

  create: ({ title, description = '', priority = 'medium', dueDate = null }) => {
    const validPriorities = ['low', 'medium', 'high'];
    const chosenPriority = validPriorities.includes(priority?.toLowerCase())
      ? priority.toLowerCase()
      : 'medium';

    const newTodo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      priority: chosenPriority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    return newTodo;
  },

  update: (id, updates) => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    const existing = todos[index];
    const validPriorities = ['low', 'medium', 'high'];

    const updatedTodo = {
      ...existing,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      completed: updates.completed !== undefined ? Boolean(updates.completed) : existing.completed,
      priority:
        updates.priority && validPriorities.includes(updates.priority.toLowerCase())
          ? updates.priority.toLowerCase()
          : existing.priority,
      dueDate: updates.dueDate !== undefined ? updates.dueDate : existing.dueDate,
      updatedAt: new Date().toISOString()
    };

    todos[index] = updatedTodo;
    return updatedTodo;
  },

  deleteById: (id) => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    return true;
  },

  deleteCompleted: () => {
    const initialCount = todos.length;
    todos = todos.filter(todo => !todo.completed);
    return initialCount - todos.length;
  }
};

module.exports = todoModel;
