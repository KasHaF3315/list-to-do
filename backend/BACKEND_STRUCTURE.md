# Backend Structure Documentation

## 📁 Organized Folder Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection with logging
│   └── logger.js        # Winston logger configuration
├── controllers/
│   ├── authController.js    # Authentication business logic
│   └── todoController.js    # Todo CRUD operations
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Global error handling
│   ├── notFound.js         # 404 route handler
│   └── requestLogger.js    # Request/response logging
├── models/
│   ├── User.js             # User schema with validation
│   └── Todo.js             # Todo schema with validation
├── routers/
│   ├── authRoutes.js       # Authentication routes
│   └── todoRoutes.js       # Todo routes
├── utils/
│   ├── asyncHandler.js     # Async error wrapper
│   ├── response.js         # Standard response utilities
│   └── validation.js       # Input validation helpers
├── logs/                   # Winston log files (auto-created)
├── server.js              # Main server file (organized)
├── server_old.js          # Backup of original server
└── server_new.js          # Alternative server version
```

## 🚀 Features Added

### ✅ Winston Logging
- **File Logging**: Separate error.log and combined.log files
- **Console Logging**: Colored output for development
- **Request Logging**: All HTTP requests/responses logged
- **Error Tracking**: Comprehensive error logging with stack traces

### ✅ Organized Architecture
- **Controllers**: Business logic separated from routes
- **Middleware**: Reusable middleware functions
- **Models**: Enhanced Mongoose schemas with validation
- **Routers**: Clean route definitions
- **Utils**: Helper functions and utilities

### ✅ Enhanced Features
- **Error Handling**: Global error handler with proper HTTP status codes
- **404 Handler**: Custom not found middleware with helpful endpoints list
- **Validation**: Input validation and sanitization
- **Response Utilities**: Standardized API responses
- **Async Handling**: Proper async error handling

## 🔧 Usage

### Start the Server
```bash
npm start        # Production
npm run dev      # Development with nodemon
```

### API Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Todos**: `/api/todos/*` (CRUD operations + stats)
- **Health**: `/api/health`

### Logging
- Logs are stored in `logs/` directory
- Console output in development mode
- Request/response logging for all endpoints
- Error tracking with stack traces

## 📝 Migration Notes
- Original server.js backed up as `server_old.js`
- New organized structure maintains all original functionality
- Winston logging added for better debugging and monitoring
- Enhanced error handling and validation
