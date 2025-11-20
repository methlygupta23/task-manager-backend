# Task Manager Backend

A RESTful API backend for managing tasks, built with Node.js, Express.js, and PostgreSQL using Sequelize ORM.

## Project Description

This is the backend API for a task management application. It provides endpoints for creating, reading, updating, and deleting tasks. The API follows RESTful conventions and uses PostgreSQL for data persistence.

### Features

- RESTful API endpoints for task management
- PostgreSQL database integration with Sequelize ORM
- CORS enabled for frontend integration
- Input validation and error handling
- Automated database synchronization
- Comprehensive test suite

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Testing**: Jest, Supertest

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (optional for local development, required for production) - [Download PostgreSQL](https://www.postgresql.org/download/)

> 💡 The backend now ships with SQLite support enabled by default, so you can run the API locally without installing PostgreSQL. Set `DB_DIALECT=postgres` (or `DB_URL`) when you're ready to connect to a PostgreSQL database.

### Verify Installation

```bash
node --version
npm --version
psql --version
```

## Installation Steps

1. **Clone the repository** (if not already cloned)
   ```bash
   git clone <repository-url>
   cd task-manager-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   
   Create a new PostgreSQL database:
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE task_manager;
   
   # Exit psql
   \q
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory (see Environment Variables section below).

5. **Start the server**
   ```bash
   # Development mode (requires nodemon)
   npm start
   
   # Or use Node directly
   node src/server.js
   ```

The server will automatically:
- Connect to the database
- Create the `tasks` table if it doesn't exist
- Start listening on port 5000 (or your configured PORT)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Database Configuration
# By default the project uses SQLite for local development.
# Uncomment the following lines only if you want to use PostgreSQL.
# DB_DIALECT=postgres
# DB_NAME=task_manager
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_HOST=127.0.0.1
# DB_PORT=5432
```

### Optional Variables

```env
# SQLite configuration (defaults shown below)
DB_DIALECT=sqlite
SQLITE_STORAGE=./data/database.sqlite

# Database URL (alternative to individual DB variables)
# If provided, DB_URL takes precedence over individual DB variables
# DB_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
```

### Using Database URL

Alternatively, you can use a single database URL (forces PostgreSQL):

```env
DB_URL=postgresql://postgres:postgres@127.0.0.1:5432/task_manager
```

**Note**:
- By default the backend uses SQLite, so you can run the API without installing PostgreSQL.
- To switch to PostgreSQL, set `DB_DIALECT=postgres` and provide the credentials above (or `DB_URL`).
- In production, set `NODE_ENV=production` and ensure SSL is configured for the database connection.

## How to Run the Application

### Development Mode

The project uses nodemon for automatic server restarts during development:

```bash
npm start
```

If nodemon is not installed or you want to run without it:

```bash
node src/server.js
```

### Production Mode

1. Set environment variables for production
2. Build the application (if needed)
3. Start the server:

```bash
NODE_ENV=production node src/server.js
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Verify Server is Running

Check the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## Running with Docker

From the repository root (where `docker-compose.yml` lives):

```bash
# Build images
docker compose build

# Start all services (PostgreSQL, backend, frontend)
docker compose up
```

The backend container listens on port `4000` (as defined in `docker-compose.yml`) and the frontend is exposed on port `3000`.

To run only the backend service:

```bash
docker compose up backend
```

Stop and remove the containers:

```bash
docker compose down
```

The compose stack also provisions a PostgreSQL instance, so no local database installation is required. Data is persisted in the named volume `db-data`.

## How to Run Tests

The project uses Jest for testing with Supertest for API endpoint testing.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Structure

Tests are located in `src/tests/task.test.js` and cover:

- GET `/api/tasks` - Fetch all tasks
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/:id` - Update task status
- DELETE `/api/tasks/:id` - Delete task
- Error handling and validation

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Get All Tasks

**GET** `/api/tasks`

Retrieve all tasks from the database, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Create Task

**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Task title",        // Required
  "description": "Description", // Optional, defaults to empty string
  "status": "pending"           // Optional, defaults to "pending"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Description",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Task created successfully
- `400 Bad Request` - Title is required or invalid input
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "description": "Finish the task manager app"}'
```

---

### Update Task Status

**PUT** `/api/tasks/:id`

Update the status of an existing task.

**URL Parameters:**
- `id` - Task UUID

**Request Body:**
```json
{
  "status": "completed"  // Required: "pending" or "completed"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Description",
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Task updated successfully
- `400 Bad Request` - Status is required or invalid
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl -X PUT http://localhost:5000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

---

### Delete Task

**DELETE** `/api/tasks/:id`

Delete a task by ID.

**URL Parameters:**
- `id` - Task UUID

**Response:**
- `204 No Content` - Task deleted successfully

**Status Codes:**
- `204 No Content` - Task deleted successfully
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/{task-id}
```

---

## Database Schema

### Tasks Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NULL | Task description |
| status | VARCHAR(32) | NOT NULL, DEFAULT 'pending' | Task status ('pending' or 'completed') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Creation timestamp |

## Project Structure

```
task-manager-backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── controllers/
│   │   └── taskController.js  # Task business logic
│   ├── models/
│   │   └── Task.js         # Task Sequelize model
│   ├── routes/
│   │   └── taskRoutes.js   # Task API routes
│   └── tests/
│       └── task.test.js    # API endpoint tests
├── .env                    # Environment variables (create this)
├── package.json
├── package-lock.json
└── README.md
```

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   # On Linux/Mac
   sudo systemctl status postgresql
   
   # On Windows
   # Check Services panel
   ```

2. **Verify database credentials** in your `.env` file

3. **Check database exists:**
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 5000 is already in use:

1. Change the `PORT` in your `.env` file
2. Or kill the process using the port:
   ```bash
   # Find process
   lsof -i :5000
   # Kill process (replace PID)
   kill -9 <PID>
   ```

## License

ISC
