const Todo = require('../models/Todo');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const devTunnelHosts = [/\.devtunnels\.ms$/i, /\.inc1\.devtunnels\.ms$/i];
const extractSource = (req) => {
  const origin = req.get('Origin') || '';
  const referer = req.get('Referer') || '';
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || req.connection?.remoteAddress || '';
  const check = origin || referer;
  let hostname = '';
  try { hostname = check ? new URL(check).hostname : ''; } catch {}
  const isDevTunnel = devTunnelHosts.some((re) => hostname && re.test(hostname));
  return { origin, referer, hostname, userAgent, ip, isDevTunnel };
};

// In-memory storage for guest todos
const guestTodos = new Map(); // guestId -> { todos: [], lastId: 0 }

// Helper function to get or initialize guest data
const getGuestData = (guestId) => {
  if (!guestTodos.has(guestId)) {
    guestTodos.set(guestId, { 
      todos: [], 
      lastId: 0,
      // Add timestamps for potential cleanup of old guest data
      createdAt: new Date(),
      lastAccessed: new Date()
    });
  } else {
    // Update last accessed time
    const data = guestTodos.get(guestId);
    data.lastAccessed = new Date();
    guestTodos.set(guestId, data);
  }
  return guestTodos.get(guestId);
};

// @desc    Get all todos for user or guest
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed, priority, category, search } = req.query;
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Build query based on user type (guest or authenticated)
    const query = {};
    
    if (req.user?.isGuest) {
      // For guest users, query by guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing from request', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      query.guestId = req.user.guestId;
    } else {
      // For authenticated users, query by userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      query.userId = req.user._id;
    }
    
    // Apply filters
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid priority value',
          message: 'Priority must be one of: low, medium, high'
        });
      }
      query.priority = priority;
    }
    
    if (category) {
      query.category = category;
    }
    
    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Get total count for pagination
    const total = await Todo.countDocuments(query);
    
    // Get paginated results
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parsedLimit)
      .lean(); // Convert to plain JavaScript objects

    logger.info('Todos retrieved', {
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null,
      count: todos.length,
      total,
      page: parsedPage,
      limit: parsedLimit
    });

    res.status(200).json({
      success: true,
      count: todos.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit) || 1,
      data: todos
    });
  } catch (error) {
    logger.error('Error getting todos', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};
// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
  try {
    // Build query based on user type
    const query = { _id: req.params.id };
    
    if (req.user?.isGuest) {
      // For guest users, query by guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing during todo retrieval', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      query.guestId = req.user.guestId;
    } else {
      // For authenticated users, query by userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      query.userId = req.user._id;
    }
    
    // Find the todo in MongoDB
    const todo = await Todo.findOne(query);

    if (!todo) {
      logger.warn('Todo not found', {
        todoId: req.params.id,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    logger.info('Todo retrieved', {
      todoId: todo._id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.name === 'CastError') {
      logger.warn('Invalid todo ID format', {
        todoId: req.params.id,
        error: error.message,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }
    logger.error('Error getting todo', {
      error: error.message,
      stack: error.stack,
      todoId: req.params.id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { title, description, completed = false, priority = 'medium', category, tags, dueDate } = req.body;

    // Input validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Title is required and must be a non-empty string'
      });
    }

    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Priority must be one of: low, medium, high'
      });
    }

    // Prevent past due dates
    if (dueDate) {
      const now = new Date();
      const chosen = new Date(dueDate);
      if (chosen < now.setSeconds(0,0)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Due date cannot be in the past'
        });
      }
    }

    // Prepare todo data for MongoDB
    const todoData = {
      title: title.trim(),
      description: description ? String(description).trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      category: category ? String(category).trim() : 'personal',
      tags: Array.isArray(tags) ? tags.map(tag => String(tag).trim()) : [],
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: extractSource(req)
    };

    // Add user/guest specific data
    if (req.user?.isGuest) {
      // For guest users, use guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing during todo creation', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      todoData.guestId = req.user.guestId;
    } else {
      // For authenticated users, use userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      todoData.userId = req.user._id;
    }

    // Create todo in MongoDB
    const todo = await Todo.create(todoData);

    logger.info('Todo created', {
      todoId: todo._id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null,
      title: todo.title
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      logger.warn('Todo validation failed', {
        error: messages,
        body: req.body,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    logger.error('Error creating todo', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, tags, dueDate } = req.body;
    const { id } = req.params;
    
    // Build query based on user type
    const query = { _id: id };
    
    if (req.user?.isGuest) {
      // For guest users, use guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing during todo update', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      query.guestId = req.user.guestId;
    } else {
      // For authenticated users, use userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      query.userId = req.user._id;
    }
    
    // Prepare update fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) {
      updateFields.description = description !== null ? String(description).trim() : null;
    }
    if (completed !== undefined) updateFields.completed = Boolean(completed);
    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Priority must be one of: low, medium, high'
        });
      }
      updateFields.priority = priority;
    }
    if (category !== undefined) {
      updateFields.category = category !== null ? String(category).trim() : null;
    }
    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags) ? tags.map(tag => String(tag).trim()) : [];
    }
    if (dueDate !== undefined) {
      updateFields.dueDate = dueDate ? new Date(dueDate) : null;
    }
    
    // Update the todo in MongoDB
    const todo = await Todo.findOneAndUpdate(
      query,
      { 
        $set: { ...updateFields, source: extractSource(req) },
        $currentDate: { updatedAt: true } 
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      logger.warn('Todo not found for update', {
        todoId: id,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Todo not found or you do not have permission to update it'
      });
    }

    logger.info('Todo updated', {
      todoId: todo._id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null,
      updates: Object.keys(updateFields)
    });

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      logger.warn('Todo update validation failed', {
        error: messages,
        todoId: req.params.id,
        updates: req.body,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (error.name === 'CastError') {
      logger.warn('Invalid todo ID format', {
        todoId: req.params.id,
        error: error.message
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }
    
    logger.error('Error updating todo', {
      error: error.message,
      stack: error.stack,
      todoId: req.params.id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Build query based on user type
    const query = { _id: id };
    
    if (req.user?.isGuest) {
      // For guest users, use guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing during todo deletion', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      query.guestId = req.user.guestId;
    } else {
      // For authenticated users, use userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      query.userId = req.user._id;
    }
    
    // Delete the todo from MongoDB
    const todo = await Todo.findOneAndDelete(query);

    if (!todo) {
      logger.warn('Todo not found for deletion', {
        todoId: id,
        userId: req.user?._id || 'guest',
        guestId: req.user?.isGuest ? req.user.guestId : null
      });
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Todo not found or you do not have permission to delete it'
      });
    }

    logger.info('Todo deleted', {
      todoId: todo._id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      logger.warn('Invalid todo ID format for deletion', {
        todoId: req.params.id,
        error: error.message
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }
    logger.error('Error deleting todo', {
      error: error.message,
      stack: error.stack,
      todoId: req.params.id,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res, next) => {
  try {
    // Build query based on user type
    const query = {};
    
    if (req.user?.isGuest) {
      // For guest users, use guestId
      if (!req.user.guestId) {
        logger.warn('Guest ID missing during stats retrieval', { user: req.user });
        return res.status(400).json({
          success: false,
          error: 'Guest session error',
          message: 'Missing guest identifier'
        });
      }
      query.guestId = req.user.guestId;
    } else {
      // For authenticated users, use userId
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'User ID not found in request'
        });
      }
      query.userId = req.user._id;
    }
    
    // Get total count
    const total = await Todo.countDocuments(query);
    
    // Get completed count
    const completed = await Todo.countDocuments({ ...query, completed: true });
    
    // Get count by priority
    const priorityCounts = await Todo.aggregate([
      { $match: query },
      { $group: { _id: { $ifNull: ['$priority', 'medium'] }, count: { $sum: 1 } } }
    ]);
    
    // Get count by category
    const categoryCounts = await Todo.aggregate([
      { $match: query },
      { $group: { _id: { $ifNull: ['$category', 'uncategorized'] }, count: { $sum: 1 } } }
    ]);
    
    // Format the stats
    const stats = {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority: priorityCounts.reduce((acc, { _id, count }) => ({
        ...acc,
        [_id]: count
      }), { high: 0, medium: 0, low: 0 }),
      byCategory: categoryCounts.reduce((acc, { _id, count }) => ({
        ...acc,
        [_id]: count
      }), {})
    };

    logger.info('Todo statistics retrieved', {
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null,
      stats
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting todo statistics', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id || 'guest',
      guestId: req.user?.isGuest ? req.user.guestId : null
    });
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats
};
