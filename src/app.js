const express = require('express');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Info / Documentation endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Todo API',
    version: '1.0.0',
    description: 'RESTful API for managing todos built with Node.js and Express',
    endpoints: {
      health: 'GET /health',
      listTodos: 'GET /api/todos?completed=true|false&search=query&priority=low|medium|high',
      getTodo: 'GET /api/todos/:id',
      createTodo: 'POST /api/todos',
      updateTodo: 'PUT /api/todos/:id',
      patchTodo: 'PATCH /api/todos/:id',
      deleteTodo: 'DELETE /api/todos/:id',
      clearCompleted: 'DELETE /api/todos'
    }
  });
});

// Mount Routes
app.use('/api/todos', todoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
