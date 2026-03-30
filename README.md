# Task Manager

A robust, full-stack Task Management application built with Node.js, Express, MongoDB, and React. Features secure JWT authentication, Role-Based Access Control, and a beautiful, modern, glassmorphism-inspired UI.

## Setup Instructions

### Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running locally on port 27017, or configure your `.env` file to point to your Mongo instance.
4. Start the server:
   ```bash
   npm start # or node app.js
   ```

### Frontend Setup
1. Open another terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) for Authentication
- Bcrypt for Password Hashing
- Rate Limiting (express-rate-limit) & Logging (Morgan)
- Swagger UI for API Documentation

**Frontend:**
- React 18
- Vite setup for ultra-fast HMR
- React Router DOM for protected routes
- Axios for API calls
- Custom premium glassmorphism CSS aesthetics

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user & get token | Public |
| GET | `/api/v1/tasks` | Get all user tasks | Private |
| POST | `/api/v1/tasks` | Create new task | Private |
| GET | `/api/v1/tasks/:id` | Get specific task | Private |
| PUT | `/api/v1/tasks/:id` | Update task | Private |
| DELETE | `/api/v1/tasks/:id` | Delete task | Private |

You can access full API documentation via Swagger UI by navigating to `http://localhost:5000/api-docs` when the backend is running.

## Authentication Flow

1. User registers or logs in via the UI.
2. The server hashes passwords using `bcrypt` and returns a secure JWT (JSON Web Token) on success, configurable with an expiry (e.g., 1h).
3. The frontend stores this token and sends it in the headers using `Authorization: Bearer <token>` for all protected `/api/v1/tasks` routes.
4. Express middleware validates the token before granting access.

## Database Schema

**User Schema**
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `role` (String, enum: `user` | `admin`, default: `user`)

**Task Schema**
- `user` (ObjectId, Ref: User)
- `title` (String, required)
- `description` (String)
- `status` (String, enum: `pending` | `in-progress` | `completed`, default: `pending`)

## Scalability Notes

For scaling this application to handle significant traffic, the following concepts apply:
- **Horizontal Scaling**: The Node.js application is stateless (thanks to JWT), meaning multiple server instances can easily be scaled horizontally behind a **Load Balancer** (like Nginx or AWS ELB).
- **Microservices Architecture**: Feature isolation could be applied by decoupling Auth and Task domains into separate scalable microservices.
- **Caching using Redis**: Database query pressure could be relieved by caching frequent GET requests like user metadata or dashboard metrics in Redis.
- **Database Indexing**: The `status` and `user` fields are queried frequently; placing indexes on these MongoDB fields avoids entire collection scans.
