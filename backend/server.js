const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Import middleware
const { requestLogger } = require('./middleware/requestLogger.middleware'); // ✅ Make sure file exists
const { errorHandler } = require('./middleware/errorHandler.middleware');
const { notFound } = require('./middleware/notFound.middleware');
const { auth } = require('./middleware/auth.middleware'); // ✅ JWT middleware
// const devTunnelLogger = require('./middleware/devTunnelLogger.middleware');

// Import routes
const authRoutes = require('./routers/auth.Routes');
const todoRoutes = require('./routers/todo.Routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Respect X-Forwarded-* headers from tunnels/reverse proxies for HTTPS detection
app.set('trust proxy', 1);

// Devtunnel logging is now embedded into User/Todo documents; standalone logger not required

// CORS configuration for cross-device access
// Allow devtunnels in development by default, or when explicitly enabled
const allowDevTunnels = process.env.ALLOW_DEVTUNNELS === 'true' || process.env.NODE_ENV === 'development';
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Fast-path: allow devtunnel origins when enabled
    if (allowDevTunnels && /https?:\/\/.*\.(devtunnels|inc1\.devtunnels)\.ms$/i.test(origin)) {
      return callback(null, true);
    }

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.43.236:3000',
      'http://192.168.1.100:3000',
      'http://192.168.1.101:3000',
      'http://192.168.1.102:3000',
      'http://192.168.1.103:3000',
      'http://192.168.1.104:3000',
      'http://192.168.1.105:3000',
      'http://192.168.1.106:3000',
      'http://192.168.1.107:3000',
      'http://192.168.1.108:3000',
      'http://192.168.1.109:3000',
      'http://192.168.1.110:3000',
      'http://192.168.1.111:3000',
      'http://192.168.1.112:3000',
      'http://192.168.1.113:3000',
      'http://192.168.1.114:3000',
      'http://192.168.1.115:3000',
      'http://192.168.1.116:3000',
      'http://192.168.1.117:3000',
      'http://192.168.1.118:3000',
      'http://192.168.1.119:3000',
      'http://192.168.1.120:3000',
      'http://192.168.1.121:3000',
      'http://192.168.1.122:3000',
      'http://192.168.1.123:3000',
      'http://192.168.1.124:3000',
      'http://192.168.1.125:3000',
      'http://192.168.1.126:3000',
      'http://192.168.1.127:3000',
      'http://192.168.1.128:3000',
      'http://192.168.1.129:3000',
      'http://192.168.1.130:3000',
      'http://192.168.1.131:3000',
      'http://192.168.1.132:3000',
      'http://192.168.1.133:3000',
      'http://192.168.1.134:3000',
      'http://192.168.1.135:3000',
      'http://192.168.1.136:3000',
      'http://192.168.1.137:3000',
      'http://192.168.1.138:3000',
      'http://192.168.1.139:3000',
      'http://192.168.1.140:3000',
      'http://192.168.1.141:3000',
      'http://192.168.1.142:3000',
      'http://192.168.1.143:3000',
      'http://192.168.1.144:3000',
      'http://192.168.1.145:3000',
      'http://192.168.1.146:3000',
      'http://192.168.1.147:3000',
      'http://192.168.1.148:3000',
      'http://192.168.1.149:3000',
      'http://192.168.1.150:3000',
      'http://192.168.1.151:3000',
      'http://192.168.1.152:3000',
      'http://192.168.1.153:3000',
      'http://192.168.1.154:3000',
      'http://192.168.1.155:3000',
      'http://192.168.1.156:3000',
      'http://192.168.1.157:3000',
      'http://192.168.1.158:3000',
      'http://192.168.1.159:3000',
      'http://192.168.1.160:3000',
      'http://192.168.1.161:3000',
      'http://192.168.1.162:3000',
      'http://192.168.1.163:3000',
      'http://192.168.1.164:3000',
      'http://192.168.1.165:3000',
      'http://192.168.1.166:3000',
      'http://192.168.1.167:3000',
      'http://192.168.1.168:3000',
      'http://192.168.1.169:3000',
      'http://192.168.1.170:3000',
      'http://192.168.1.171:3000',
      'http://192.168.1.172:3000',
      'http://192.168.1.173:3000',
      'http://192.168.1.174:3000',
      'http://192.168.1.175:3000',
      'http://192.168.1.176:3000',
      'http://192.168.1.177:3000',
      'http://192.168.1.178:3000',
      'http://192.168.1.179:3000',
      'http://192.168.1.180:3000',
      'http://192.168.1.181:3000',
      'http://192.168.1.182:3000',
      'http://192.168.1.183:3000',
      'http://192.168.1.184:3000',
      'http://192.168.1.185:3000',
      'http://192.168.1.186:3000',
      'http://192.168.1.187:3000',
      'http://192.168.1.188:3000',
      'http://192.168.1.189:3000',
      'http://192.168.1.190:3000',
      'http://192.168.1.191:3000',
      'http://192.168.1.192:3000',
      'http://192.168.1.193:3000',
      'http://192.168.1.194:3000',
      'http://192.168.1.195:3000',
      'http://192.168.1.196:3000',
      'http://192.168.1.197:3000',
      'http://192.168.1.198:3000',
      'http://192.168.1.199:3000',
      'http://192.168.1.200:3000',
      'http://192.168.1.201:3000',
      'http://192.168.1.202:3000',
      'http://192.168.1.203:3000',
      'http://192.168.1.204:3000',
      'http://192.168.1.205:3000',
      'http://192.168.1.206:3000',
      'http://192.168.1.207:3000',
      'http://192.168.1.208:3000',
      'http://192.168.1.209:3000',
      'http://192.168.1.210:3000',
      'http://192.168.1.211:3000',
      'http://192.168.1.212:3000',
      'http://192.168.1.213:3000',
      'http://192.168.1.214:3000',
      'http://192.168.1.215:3000',
      'http://192.168.1.216:3000',
      'http://192.168.1.217:3000',
      'http://192.168.1.218:3000',
      'http://192.168.1.219:3000',
      'http://192.168.1.220:3000',
      'http://192.168.1.221:3000',
      'http://192.168.1.222:3000',
      'http://192.168.1.223:3000',
      'http://192.168.1.224:3000',
      'http://192.168.1.225:3000',
      'http://192.168.1.226:3000',
      'http://192.168.1.227:3000',
      'http://192.168.1.228:3000',
      'http://192.168.1.229:3000',
      'http://192.168.1.230:3000',
      'http://192.168.1.231:3000',
      'http://192.168.1.232:3000',
      'http://192.168.1.233:3000',
      'http://192.168.1.234:3000',
      'http://192.168.1.235:3000',
      'http://192.168.1.236:3000',
      'http://192.168.1.237:3000',
      'http://192.168.1.238:3000',
      'http://192.168.1.239:3000',
      'http://192.168.1.240:3000',
      'http://192.168.1.241:3000',
      'http://192.168.1.242:3000',
      'http://192.168.1.243:3000',
      'http://192.168.1.244:3000',
      'http://192.168.1.245:3000',
      'http://192.168.1.246:3000',
      'http://192.168.1.247:3000',
      'http://192.168.1.248:3000',
      'http://192.168.1.249:3000',
      'http://192.168.1.250:3000',
      'http://192.168.1.251:3000',
      'http://192.168.1.252:3000',
      'http://192.168.1.253:3000',
      'http://192.168.1.254:3000',
      'http://192.168.1.255:3000',
      'http://192.168.43.236:3000',
      'http://192.168.43.237:3000',
      'http://192.168.43.238:3000',
      'http://192.168.43.239:3000',
      'http://192.168.43.240:3000',
      'http://192.168.43.241:3000',
      'http://192.168.43.242:3000',
      'http://192.168.43.243:3000',
      'http://192.168.43.244:3000',
      'http://192.168.43.245:3000',
      'http://192.168.43.246:3000',
      'http://192.168.43.247:3000',
      'http://192.168.43.248:3000',
      'http://192.168.43.249:3000',
      'http://192.168.43.250:3000',
      'http://192.168.43.251:3000',
      'http://192.168.43.252:3000',
      'http://192.168.43.253:3000',
      'http://192.168.43.254:3000',
      'http://192.168.43.255:3000',
      'http://192.168.43.100:3000',
      'http://192.168.43.101:3000',
      'http://192.168.43.102:3000',
      'http://192.168.43.103:3000',
      'http://192.168.43.104:3000',
      'http://192.168.43.105:3000',
      'http://192.168.43.106:3000',
      'http://192.168.43.107:3000',
      'http://192.168.43.108:3000',
      'http://192.168.43.109:3000',
      'http://192.168.43.110:3000',
      'http://192.168.43.111:3000',
      'http://192.168.43.112:3000',
      'http://192.168.43.113:3000',
      'http://192.168.43.114:3000',
      'http://192.168.43.115:3000',
      'http://192.168.43.116:3000',
      'http://192.168.43.117:3000',
      'http://192.168.43.118:3000',
      'http://192.168.43.119:3000',
      'http://192.168.43.120:3000',
      'http://192.168.43.121:3000',
      'http://192.168.43.122:3000',
      'http://192.168.43.123:3000',
      'http://192.168.43.124:3000',
      'http://192.168.43.125:3000',
      'http://192.168.43.126:3000',
      'http://192.168.43.127:3000',
      'http://192.168.43.128:3000',
      'http://192.168.43.129:3000',
      'http://192.168.43.130:3000',
      'http://192.168.43.131:3000',
      'http://192.168.43.132:3000',
      'http://192.168.43.133:3000',
      'http://192.168.43.134:3000',
      'http://192.168.43.135:3000',
      'http://192.168.43.136:3000',
      'http://192.168.43.137:3000',
      'http://192.168.43.138:3000',
      'http://192.168.43.139:3000',
      'http://192.168.43.140:3000',
      'http://192.168.43.141:3000',
      'http://192.168.43.142:3000',
      'http://192.168.43.143:3000',
      'http://192.168.43.144:3000',
      'http://192.168.43.145:3000',
      'http://192.168.43.146:3000',
      'http://192.168.43.147:3000',
      'http://192.168.43.148:3000',
      'http://192.168.43.149:3000',
      'http://192.168.43.150:3000',
      'http://192.168.43.151:3000',
      'http://192.168.43.152:3000',
      'http://192.168.43.153:3000',
      'http://192.168.43.154:3000',
      'http://192.168.43.155:3000',
      'http://192.168.43.156:3000',
      'http://192.168.43.157:3000',
      'http://192.168.43.158:3000',
      'http://192.168.43.159:3000',
      'http://192.168.43.160:3000',
      'http://192.168.43.161:3000',
      'http://192.168.43.162:3000',
      'http://192.168.43.163:3000',
      'http://192.168.43.164:3000',
      'http://192.168.43.165:3000',
      'http://192.168.43.166:3000',
      'http://192.168.43.167:3000',
      'http://192.168.43.168:3000',
      'http://192.168.43.169:3000',
      'http://192.168.43.170:3000',
      'http://192.168.43.171:3000',
      'http://192.168.43.172:3000',
      'http://192.168.43.173:3000',
      'http://192.168.43.174:3000',
      'http://192.168.43.175:3000',
      'http://192.168.43.176:3000',
      'http://192.168.43.177:3000',
      'http://192.168.43.178:3000',
      'http://192.168.43.179:3000',
      'http://192.168.43.180:3000',
      'http://192.168.43.181:3000',
      'http://192.168.43.182:3000',
      'http://192.168.43.183:3000',
      'http://192.168.43.184:3000',
      'http://192.168.43.185:3000',
      'http://192.168.43.186:3000',
      'http://192.168.43.187:3000',
      'http://192.168.43.188:3000',
      'http://192.168.43.189:3000',
      'http://192.168.43.190:3000',
      'http://192.168.43.191:3000',
      'http://192.168.43.192:3000',
      'http://192.168.43.193:3000',
      'http://192.168.43.194:3000',
      'http://192.168.43.195:3000',
      'http://192.168.43.196:3000',
      'http://192.168.43.197:3000',
      'http://192.168.43.198:3000',
      'http://192.168.43.199:3000',
      'http://192.168.43.200:3000',
      'http://192.168.43.201:3000',
      'http://192.168.43.202:3000',
      'http://192.168.43.203:3000',
      'http://192.168.43.204:3000',
      'http://192.168.43.205:3000',
      'http://192.168.43.206:3000',
      'http://192.168.43.207:3000',
      'http://192.168.43.208:3000',
      'http://192.168.43.209:3000',
      'http://192.168.43.210:3000',
      'http://192.168.43.211:3000',
      'http://192.168.43.212:3000',
      'http://192.168.43.213:3000',
      'http://192.168.43.214:3000',
      'http://192.168.43.215:3000',
      'http://192.168.43.216:3000',
      'http://192.168.43.217:3000',
      'http://192.168.43.218:3000',
      'http://192.168.43.219:3000',
      'http://192.168.43.220:3000',
      'http://192.168.43.221:3000',
      'http://192.168.43.222:3000',
      'http://192.168.43.223:3000',
      'http://192.168.43.224:3000',
      'http://192.168.43.225:3000',
      'http://192.168.43.226:3000',
      'http://192.168.43.227:3000',
      'http://192.168.43.228:3000',
      'http://192.168.43.229:3000',
      'http://192.168.43.230:3000',
      'http://192.168.43.231:3000',
      'http://192.168.43.232:3000',
      'http://192.168.43.233:3000',
      'http://192.168.43.234:3000',
      'http://192.168.43.235:3000',
      'http://192.168.43.236:3000',
      'http://192.168.43.237:3000',
      'http://192.168.43.238:3000',
      'http://192.168.43.239:3000',
      'http://192.168.43.240:3000',
      'http://192.168.43.241:3000',
      'http://192.168.43.242:3000',
      'http://192.168.43.243:3000',
      'http://192.168.43.244:3000',
      'http://192.168.43.245:3000',
      'http://192.168.43.246:3000',
      'http://192.168.43.247:3000',
      'http://192.168.43.248:3000',
      'http://192.168.43.249:3000',
      'http://192.168.43.250:3000',
      'http://192.168.43.251:3000',
      'http://192.168.43.252:3000',
      'http://192.168.43.253:3000',
      'http://192.168.43.254:3000',
      'http://192.168.43.255:3000',
      // Dev tunnels (redundant when fast-path above matches)
      ...(allowDevTunnels ? [/^https?:\/\/.*\.devtunnels\.ms$/, /^https?:\/\/.*\.inc1\.devtunnels\.ms$/] : []),
      // Add production origins
      /^https?:\/\/.*\.netlify\.app$/,
      /^https?:\/\/.*\.vercel\.app$/,
      /^https?:\/\/.*\.onrender\.com$/,
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-Total-Count"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Cookie parser middleware
app.use(cookieParser());

// Body parser with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (auth applied inside router)
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  logger.info('Health check accessed', { 
    ip: req.ip,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')
  });
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'connected' // You can add actual DB status check here
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`🌐 Server accessible from network on port ${PORT}`);
  logger.info(`📱 Cross-device access enabled`);
});

module.exports = app;
