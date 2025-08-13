const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats
} = require('../controllers/todo.Controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   GET /api/todos/stats
// @desc    Get todo statistics
// @access  Private
router.get('/stats', getTodoStats);

// @route   GET /api/todos
// @desc    Get all todos for user
// @access  Private
router.get('/', getTodos);

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private
router.post('/', createTodo);

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get('/:id', getTodo);

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', updateTodo);

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', deleteTodo);

module.exports = router;
