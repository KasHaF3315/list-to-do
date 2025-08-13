# TodoApp Complete Setup Guide

## Overview
This TodoApp is a full-stack application with:
- **Frontend**: Next.js with TypeScript, Zustand state management
- **Backend**: Node.js/Express with MongoDB database
- **Cross-device access**: Works on any device on the same network
- **Real-time data sync**: Data stored in MongoDB database

## Prerequisites

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/) (version 16 or higher)

### 2. Install MongoDB (Optional but Recommended)
- **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

### 3. Network Configuration
- Ensure your computer and devices are on the same WiFi network
- Note your computer's IP address (usually starts with 192.168.x.x)

## Quick Start

### Option 1: Automatic Setup (Recommended)
1. Double-click `start-universal.bat` (Windows)
2. Wait for both servers to start
3. Access the app from any device

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### Step 2: Configure Environment
```bash
# Copy environment example
copy backend\env.example backend\.env

# Edit backend\.env with your settings:
MONGODB_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

#### Step 3: Start MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
mongod
```

#### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```

#### Step 5: Start Frontend Server
```bash
# In a new terminal
npm run dev -- --hostname 0.0.0.0
```

## Access URLs

### From Your Computer
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### From Other Devices (Phone, Tablet, etc.)
- Frontend: http://192.168.43.236:3000
- Backend API: http://192.168.43.236:5000

**Note**: Replace `192.168.43.236` with your computer's actual IP address.

## Features

### ✅ Backend-Frontend Connection
- RESTful API with Express.js
- JWT authentication
- MongoDB database storage
- Real-time data synchronization

### ✅ Cross-Device Access
- CORS configured for network access
- Responsive design for mobile devices
- Shared data across all devices

### ✅ Database Storage
- MongoDB for persistent data storage
- User authentication and authorization
- Todo CRUD operations
- Data backup and recovery

### ✅ Offline Support
- Local storage fallback
- Automatic sync when connection restored
- Graceful error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Todos (Requires Authentication)
- `GET /api/todos` - Get all user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/stats` - Get todo statistics

### Health Check
- `GET /api/health` - Server status

## Troubleshooting

### Can't Access from Other Devices?
1. **Check Firewall**: Allow connections on ports 3000 and 5000
2. **Verify IP Address**: Make sure you're using the correct IP
3. **Network Connection**: Ensure devices are on same WiFi
4. **Server Status**: Check both servers are running

### Registration/Login Not Working?
1. **Wait for Startup**: Give servers 30 seconds to fully start
2. **Check Backend**: Look for errors in backend terminal
3. **MongoDB**: Ensure MongoDB is running
4. **Refresh Browser**: Clear cache and refresh page

### Database Connection Issues?
1. **MongoDB Status**: Check if MongoDB is running
2. **Connection String**: Verify MONGODB_URI in .env
3. **Network Access**: Ensure MongoDB accepts connections
4. **Fallback Mode**: App works with local storage if DB unavailable

### Performance Issues?
1. **Network Speed**: Check WiFi connection quality
2. **Server Resources**: Monitor CPU and memory usage
3. **Database Indexes**: MongoDB indexes are configured for performance
4. **Caching**: Frontend uses local storage for caching

## Development

### Project Structure
```
TodoApp/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── store/            # Zustand state management
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── backend/              # Backend source code
│   ├── controllers/      # API controllers
│   ├── models/          # MongoDB models
│   ├── routers/         # API routes
│   ├── middleware/      # Express middleware
│   └── config/          # Configuration files
└── start-universal.bat  # Quick start script
```

### Adding New Features
1. **Backend**: Add routes in `backend/routers/`
2. **Frontend**: Add components in `src/components/`
3. **State**: Update stores in `src/store/`
4. **Types**: Update type definitions in `src/types/`

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development

# Frontend (next.config.js)
NEXT_PUBLIC_API_URL=http://192.168.43.236:5000
```

## Security Considerations

### Production Deployment
1. **Change JWT Secret**: Use a strong, unique secret
2. **HTTPS**: Use SSL certificates for production
3. **Environment Variables**: Don't commit secrets to git
4. **CORS**: Restrict origins to your domain
5. **Rate Limiting**: Implement API rate limiting
6. **Input Validation**: Validate all user inputs

### Data Protection
1. **Password Hashing**: Passwords are hashed with bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **User Isolation**: Each user only sees their own data
4. **Input Sanitization**: All inputs are validated and sanitized

## Support

### Common Issues
- **Port Already in Use**: Kill existing processes or change ports
- **MongoDB Connection**: Check if MongoDB service is running
- **Network Access**: Verify firewall and network settings
- **CORS Errors**: Check CORS configuration in backend

### Getting Help
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure both servers are running
4. Check network connectivity
5. Review this setup guide

## License
This project is open source and available under the MIT License.
