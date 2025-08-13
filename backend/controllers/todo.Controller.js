const Todo = require('../models/Todo');
const logger = require('../config/logger');

// In-memory storage for guest users
const guestTodos = new Map();

// @desc    Get all todos for user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed, priority, category, search } = req.query;

    // Handle guest users
    if (req.user.isGuest) {
      const guestId = req.user._id;
      let todos = guestTodos.get(guestId) || [];

      // Apply filters
      if (completed !== undefined) {
        todos = todos.filter(todo => todo.completed === (completed === 'true'));
      }

      if (priority) {
        todos = todos.filter(todo => todo.priority === priority);
      }

      if (category) {
        todos = todos.filter(todo => todo.category === category);
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        todos = todos.filter(todo =>
          searchRegex.test(todo.title) || searchRegex.test(todo.description)
        );
      }

      // Sort by createdAt (newest first)
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const total = todos.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTodos = todos.slice(startIndex, endIndex);

      logger.info('Guest todos retrieved', {
        guestId,
        count: paginatedTodos.length,
        total,
        filters: { completed, priority, category, search }
      });

      return res.json({
        success: true,
        count: paginatedTodos.length,
        total,
        data: paginatedTodos
      });
    }

    // Regular user logic
    const query = { userId: req.user._id };

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    if (priority) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Todo.countDocuments(query);

    logger.info('Todos retrieved', {
      userId: req.user._id,
      count: todos.length,
      total,
      filters: { completed, priority, category, search }
    });

    res.json({
      success: true,
      count: todos.length,
      total,
      data: todos
    });
  } catch (error) {
    logger.error('Get todos error:', error);
    next(error);
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      logger.warn('Todo not found', {
        todoId: req.params.id,
        userId: req.user._id
      });
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    logger.info('Todo retrieved', {
      todoId: todo._id,
      userId: req.user._id
    });

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    logger.error('Get todo error:', error);
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, category, tags, dueDate, completed } = req.body;

    // Handle guest users
    if (req.user.isGuest) {
      const guestId = req.user._id;
      const todoId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      const todo = {
        _id: todoId,
        title,
        description: description || '',
        priority: priority || 'medium',
        category: category || 'personal',
        tags: tags || [],
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed || false,
        userId: guestId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in memory
      const guestTodoList = guestTodos.get(guestId) || [];
      guestTodoList.unshift(todo); // Add to beginning
      guestTodos.set(guestId, guestTodoList);

      logger.info('Guest todo created', {
        todoId: todo._id,
        guestId,
        title: todo.title
      });

      return res.status(201).json({
        success: true,
        data: todo
      });
    }

    // Regular user logic
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

    logger.info('Todo created', {
      todoId: todo._id,
      userId: req.user._id,
      title: todo.title
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    logger.error('Create todo error:', error);
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    // Handle guest users
    if (req.user.isGuest) {
      const guestId = req.user._id;
      const todoId = req.params.id;
      const guestTodoList = guestTodos.get(guestId) || [];

      const todoIndex = guestTodoList.findIndex(todo => todo._id === todoId);

      if (todoIndex === -1) {
        logger.warn('Guest todo not found for update', {
          todoId,
          guestId
        });
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      // Update the todo
      const updatedTodo = {
        ...guestTodoList[todoIndex],
        ...req.body,
        updatedAt: new Date()
      };

      guestTodoList[todoIndex] = updatedTodo;
      guestTodos.set(guestId, guestTodoList);

      logger.info('Guest todo updated', {
        todoId: updatedTodo._id,
        guestId,
        changes: Object.keys(req.body)
      });

      return res.json({
        success: true,
        data: updatedTodo
      });
    }

    // Regular user logic
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!todo) {
      logger.warn('Todo not found for update', {
        todoId: req.params.id,
        userId: req.user._id
      });
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    logger.info('Todo updated', {
      todoId: todo._id,
      userId: req.user._id,
      changes: Object.keys(req.body)
    });

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    logger.error('Update todo error:', error);
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    // Handle guest users
    if (req.user.isGuest) {
      const guestId = req.user._id;
      const todoId = req.params.id;
      const guestTodoList = guestTodos.get(guestId) || [];

      const todoIndex = guestTodoList.findIndex(todo => todo._id === todoId);

      if (todoIndex === -1) {
        logger.warn('Guest todo not found for deletion', {
          todoId,
          guestId
        });
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      const deletedTodo = guestTodoList[todoIndex];
      guestTodoList.splice(todoIndex, 1);
      guestTodos.set(guestId, guestTodoList);

      logger.info('Guest todo deleted', {
        todoId: deletedTodo._id,
        guestId,
        title: deletedTodo.title
      });

      return res.json({
        success: true,
        data: {}
      });
    }

    // Regular user logic
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      logger.warn('Todo not found for deletion', {
        todoId: req.params.id,
        userId: req.user._id
      });
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    logger.info('Todo deleted', {
      todoId: todo._id,
      userId: req.user._id,
      title: todo.title
    });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Delete todo error:', error);
    next(error);
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res, next) => {
  try {
    // Handle guest users
    if (req.user.isGuest) {
      const guestId = req.user._id;
      const todos = guestTodos.get(guestId) || [];

      const stats = {
        total: todos.length,
        completed: todos.filter(todo => todo.completed).length,
        pending: todos.filter(todo => !todo.completed).length,
        high: todos.filter(todo => todo.priority === 'high').length,
        medium: todos.filter(todo => todo.priority === 'medium').length,
        low: todos.filter(todo => todo.priority === 'low').length
      };

      logger.info('Guest todo stats retrieved', {
        guestId,
        stats
      });

      return res.json({
        success: true,
        data: stats
      });
    }

    // Regular user logic
    const userId = req.user._id;

    const stats = await Todo.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    logger.info('Todo stats retrieved', {
      userId: req.user._id,
      stats: result
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get todo stats error:', error);
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
