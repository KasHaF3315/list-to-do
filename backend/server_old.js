// OLD SERVER FILE - MOVED TO server_old.js
// This file has been replaced with organized structure
// See server_new.js for the new implementation

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Universal CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost and 127.0.0.1 on any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
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
    console.log('CORS rejected origin:', origin);
    console.log('If this should be allowed, please update CORS configuration');
    
    // For development, allow all origins (comment out for production)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect("KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, default: 'personal' },
  tags: { type: [String], default: [] },
  dueDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // In development mode, create a default user if no token provided
    if (process.env.NODE_ENV !== 'production') {
      try {
        let defaultUser = await User.findOne({ email: 'dev@example.com' });
        if (!defaultUser) {
          defaultUser = new User({
            name: 'Development User',
            email: 'dev@example.com',
            password: await bcrypt.hash('password', 10)
          });
          await defaultUser.save();
        }
        req.user = defaultUser;
        return next();
      } catch (error) {
        console.error('Error creating default user:', error);
      }
    }
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Todo Routes
app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, category, tags, dueDate, completed } = req.body;
    
    const todo = new Todo({
      title,
      description,
      priority,
      category,
      tags,
      dueDate,
      completed: completed || false,
      userId: req.user._id
    });
    
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TodoApp Backend API is running!', 
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/register, /api/auth/login',
      todos: '/api/todos'
    },
    timestamp: new Date().toISOString() 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('TodoApp Backend Server Started!');
  console.log('========================================');
  console.log(`Port: ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('Access from other devices on your network:');
  console.log(`http://[YOUR-IP-ADDRESS]:${PORT}`);
  console.log('');
  console.log('To find your IP address:');
  console.log('Windows: ipconfig');
  console.log('Mac/Linux: ifconfig');
  console.log('');
  console.log('API Endpoints:');
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`Todos: GET/POST/PUT/DELETE http://localhost:${PORT}/api/todos`);
  console.log('========================================');
});