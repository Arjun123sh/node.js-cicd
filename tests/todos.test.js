const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

before(() => {
  return new Promise((resolve) => {
    // Listen on port 0 for an available dynamic port
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

describe('Todo API Endpoints', () => {
  let createdTodoId;

  test('GET /health - should return status OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'OK');
  });

  test('GET / - should return API documentation', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, 'Todo API');
    assert.ok(body.endpoints);
  });

  test('GET /api/todos - should return existing todos list', async () => {
    const res = await fetch(`${baseUrl}/api/todos`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 2);
  });

  test('POST /api/todos - should validate required title', async () => {
    const res = await fetch(`${baseUrl}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Missing title' })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /title/i);
  });

  test('POST /api/todos - should create a new todo', async () => {
    const newTodo = {
      title: 'Write CI/CD workflow',
      description: 'Configure GitHub Actions for automated testing',
      priority: 'high'
    };
    const res = await fetch(`${baseUrl}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, newTodo.title);
    assert.equal(body.data.completed, false);
    assert.equal(body.data.priority, 'high');
    assert.ok(body.data.id);
    createdTodoId = body.data.id;
  });

  test('GET /api/todos/:id - should get created todo by ID', async () => {
    const res = await fetch(`${baseUrl}/api/todos/${createdTodoId}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, createdTodoId);
  });

  test('GET /api/todos/:id - should return 404 for non-existent id', async () => {
    const res = await fetch(`${baseUrl}/api/todos/non-existent-id-12345`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  test('PATCH /api/todos/:id - should mark todo as completed', async () => {
    const res = await fetch(`${baseUrl}/api/todos/${createdTodoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.completed, true);
  });

  test('PUT /api/todos/:id - should replace todo fields', async () => {
    const updated = {
      title: 'Write CI/CD workflow - Updated',
      description: 'Updated description',
      completed: true,
      priority: 'low'
    };
    const res = await fetch(`${baseUrl}/api/todos/${createdTodoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, updated.title);
    assert.equal(body.data.priority, 'low');
  });

  test('GET /api/todos with filtering - query completed', async () => {
    const res = await fetch(`${baseUrl}/api/todos?completed=true`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.every(todo => todo.completed === true));
  });

  test('DELETE /api/todos/:id - should delete the created todo', async () => {
    const res = await fetch(`${baseUrl}/api/todos/${createdTodoId}`, {
      method: 'DELETE'
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);

    // Verify it is gone
    const verifyRes = await fetch(`${baseUrl}/api/todos/${createdTodoId}`);
    assert.equal(verifyRes.status, 404);
  });
});
