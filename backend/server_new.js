const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Import middleware
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routers/authRoutes');
const todoRoutes = require('./routers/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware - Universal CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost and 127.0.0.1 on any port
    if (origin.includes('localhost') || origin.includes('mongodb+srv://KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority')) {
      return callback(null, true);
    }
    
    // Allow VS Code dev tunnels
    if (origin.includes('devtunnels.ms') || origin.includes('inc1.devtunnels.ms')) {
      return callback(null, true);
    }
    
    // Allow deployment platforms
    if (origin.includes('netlify.app') || origin.includes('vercel.app') || 
        origin.includes('railway.app') || origin.includes('render.com') ||
        origin.includes('onrender.com') || origin.includes('herokuapp.com')) {
      return callback(null, true);
    }
    
    // Allow local network access (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const url = new URL(origin);
    const hostname = url.hostname;
    const isLocalNetwork = 
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      (hostname.startsWith('172.') && 
       parseInt(hostname.split('.')[1]) >= 16 && 
       parseInt(hostname.split('.')[1]) <= 31);
    
    if (isLocalNetwork) {
      return callback(null, true);
    }
    
    // Allow any origin that looks like a computer name or IP
    if (/^[a-zA-Z0-9-]+$/.test(hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    logger.warn('CORS rejected origin', { origin });
    
    // For development, allow all origins (comment out for production)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed', { ip: req.ip });
  res.json({ 
    message: 'TodoApp Backend API is running!', 
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      todos: {
        list: 'GET /api/todos',
        create: 'POST /api/todos',
        get: 'GET /api/todos/:id',
        update: 'PUT /api/todos/:id',
        delete: 'DELETE /api/todos/:id',
        stats: 'GET /api/todos/stats'
      }
    },
    timestamp: new Date().toISOString() 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  logger.info('Health check accessed', { ip: req.ip });
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('========================================');
  logger.info('TodoApp Backend Server Started!');
  logger.info('========================================');
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Port: ${PORT}`);
  logger.info(`Local access: http://localhost:${PORT}`);
  logger.info(`Network access: http://0.0.0.0:${PORT}`);
  logger.info('');
  logger.info('Access from other devices on your network:');
  logger.info(`http://[YOUR-IP-ADDRESS]:${PORT}`);
  logger.info('');
  logger.info('To find your IP address:');
  logger.info('Windows: ipconfig');
  logger.info('Mac/Linux: ifconfig');
  logger.info('');
  logger.info('API Endpoints:');
  logger.info(`Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`Auth: http://localhost:${PORT}/api/auth/*`);
  logger.info(`Todos: http://localhost:${PORT}/api/todos/*`);
  logger.info('========================================');
});

module.exports = app;
