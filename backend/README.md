# TodoApp Backend

A Node.js/Express backend API for the TodoApp with MongoDB integration.

## Features

- ✅ User Authentication (Register/Login)
- ✅ JWT Token-based Authorization
- ✅ CRUD Operations for Todos
- ✅ MongoDB Database Integration
- ✅ Password Hashing with bcrypt
- ✅ CORS Support for Frontend Integration

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your MongoDB URI and JWT secret.

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

4. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Todos (Requires Authentication)
- `GET /api/todos` - Get all user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Frontend Integration

The backend runs on `http://localhost:5000` by default. Make sure your frontend is configured to make API calls to this URL.
