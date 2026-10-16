# Todo REST API (Node.js & Express)

A RESTful API for a Todo application built with Node.js and Express.

## Project Structure

```text
├── src/
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # Server entrypoint (listening on PORT)
│   ├── controllers/
│   │   └── todoController.js# Request/response logic and validation
│   ├── models/
│   │   └── todoModel.js     # Data access layer & in-memory store
│   └── routes/
│       └── todoRoutes.js    # Express routes for /api/todos
├── tests/
│   └── todos.test.js        # Automated integration tests (node:test)
├── package.json
└── README.md
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
The server will start on `http://localhost:3000` (or the port defined by `PORT` environment variable).

### 3. Run Tests
```bash
npm test
```

---

## API Endpoints

### Base / Health
- `GET /` — API overview and endpoint guide
- `GET /health` — Service health check & uptime

### Todos (`/api/todos`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | List all todos (supports `?completed=true|false`, `?search=keyword`, `?priority=low|medium|high`) |
| `GET` | `/api/todos/:id` | Get details for a single todo by ID |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Full update/replacement of an existing todo |
| `PATCH` | `/api/todos/:id` | Partial update (e.g. toggle completed or change title) |
| `DELETE` | `/api/todos/:id` | Delete a specific todo by ID |
| `DELETE` | `/api/todos` | Clear all completed todos |

---

### Request & Response Examples

#### 1. Create a Todo (`POST /api/todos`)
**Request Body:**
```json
{
  "title": "Setup CI/CD pipeline",
  "description": "Create GitHub Actions workflow for testing and deployment",
  "priority": "high",
  "dueDate": "2026-10-25"
}
```
**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "e44d0840-7ab1-46ca-a1f9-906057a6e118",
    "title": "Setup CI/CD pipeline",
    "description": "Create GitHub Actions workflow for testing and deployment",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-10-25",
    "createdAt": "2026-10-16T10:20:00.000Z",
    "updatedAt": "2026-10-16T10:20:00.000Z"
  }
}
```

#### 2. Get Todos with Filters (`GET /api/todos?completed=false&priority=high`)
**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "e44d0840-7ab1-46ca-a1f9-906057a6e118",
      "title": "Setup CI/CD pipeline",
      "completed": false,
      "priority": "high"
    }
  ]
}
```

#### 3. Mark Todo as Completed (`PATCH /api/todos/:id`)
**Request Body:**
```json
{
  "completed": true
}
```
**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "e44d0840-7ab1-46ca-a1f9-906057a6e118",
    "completed": true
  }
}
```
