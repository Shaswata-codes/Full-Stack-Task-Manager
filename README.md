# TaskSync 📋

TaskSync is a modern, responsive, full-stack task manager built to help you organize your daily work. It features user authentication, status tracking, task prioritization, due dates, and a clean, clutter-free dashboard.

---

## ✨ Features

- **Secure Authentication**: Sign up and log in securely. Passwords are encrypted on the server using `bcryptjs`, and sessions are managed via JWT.
- **Task Management**: Create tasks, set priorities (`High`, `Medium`, `Low`), attach due dates, and mark tasks as complete.
- **Clean Dashboard**: Quickly view and filter your tasks based on their completion status or priority.
- **Bulk Cleanup**: Clear out all completed tasks with one click to keep your workspace tidy.
- **Production Ready**: Fully structured to deploy easily to Vercel as a monorepo.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (v4), React Router DOM, React Icons.
- **Backend**: Node.js, Express.js (v5), MongoDB, Mongoose (v9).
- **Session Security**: JSON Web Tokens (JWT), `bcryptjs`, CORS middleware.

---

## 📂 Project Structure

```
major-project/
├── backend/                  # Express API
│   ├── src/
│   │   ├── middleware/       # Auth guard & payload validations
│   │   ├── models/           # User & Task mongoose schemas
│   │   ├── routes/           # Auth and Task routing logic
│   │   ├── app.js            # Express app initialization
│   │   └── db.config.js      # MongoDB connection helper
│   └── index.js              # Server entry point
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Common components (Navbar, Footer, etc.)
│   │   ├── pages/            # Page components (Dashboard, Login, Register)
│   │   └── App.jsx           # Routing configuration
│   └── index.html
└── vercel.json               # Monorepo deployment configs
```

---

## 🚀 Setup & Installation

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- A running MongoDB instance (Local MongoDB Community Server or MongoDB Atlas)

---

### 1. Set Up the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your configurations:
   ```env
   PORT=4500
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *(If not specified, `PORT` defaults to `1234` and `JWT_SECRET` defaults to `fallbacksecret`)*
4. Run the backend server in development mode:
   ```bash
   npm run dev
   ```

---

### 2. Set Up the Frontend

1. Open a new terminal tab/window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.development` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:4500/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser to view the application!

---

## 📡 API Reference

All requests and responses use JSON. For any route in the **Tasks** section, you must include a valid JWT token in your headers:
```http
Authorization: Bearer <your_token_here>
```

### Authentication Endpoints

#### `POST /api/v1/auth/register`
Creates a new account and returns a token.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "mysecretpassword"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "648a123f...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### `POST /api/v1/auth/login`
Logs in an existing user.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "mysecretpassword"
  }
  ```
- **Response (`200 OK`)**:
  *(Returns the same payload structure as the register endpoint)*

---

### Tasks Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/tasks` | Create a new task |
| `GET` | `/api/v1/tasks` | Get all tasks for the logged-in user |
| `GET` | `/api/v1/tasks/:id` | Get details for a single task |
| `PUT` | `/api/v1/tasks/:id` | Update an existing task |
| `DELETE` | `/api/v1/tasks/:id` | Delete a single task |
| `DELETE` | `/api/v1/tasks/completed` | Clear all completed tasks |

#### Request & Response Examples

##### Create a Task (`POST /api/v1/tasks`)
- **Body**:
  ```json
  {
    "title": "Launch TaskSync",
    "description": "Deploy backend to Vercel and check all environment variables.",
    "priority": "High",
    "dueDate": "2026-07-01T12:00:00Z"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "_id": "648f98a2...",
    "title": "Launch TaskSync",
    "description": "Deploy backend to Vercel and check all environment variables.",
    "priority": "High",
    "dueDate": "2026-07-01T12:00:00.000Z",
    "completed": false,
    "owner": "648a123f...",
    "createdAt": "2026-06-29T14:10:00.000Z",
    "updatedAt": "2026-06-29T14:10:00.000Z"
  }
  ```

##### Update a Task (`PUT /api/v1/tasks/:id`)
You can perform partial updates by sending only the fields you want to change (e.g., status, priority, title).
- **Body**:
  ```json
  {
    "completed": true
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "_id": "648f98a2...",
    "title": "Launch TaskSync",
    "description": "Deploy backend to Vercel and check all environment variables.",
    "priority": "High",
    "dueDate": "2026-07-01T12:00:00.000Z",
    "completed": true,
    "owner": "648a123f...",
    "createdAt": "2026-06-29T14:10:00.000Z",
    "updatedAt": "2026-06-29T14:15:00.000Z"
  }
  ```

##### Bulk Delete Completed Tasks (`DELETE /api/v1/tasks/completed`)
- **Response (`200 OK`)**:
  ```json
  {
    "message": "Completed tasks deleted successfully.",
    "count": 4
  }
  ```
