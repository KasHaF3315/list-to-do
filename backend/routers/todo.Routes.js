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
const guestAuth = require('../middleware/guest.middleware');

const router = express.Router();

// Apply guest authentication middleware first (sets req.user for guests)
router.use(guestAuth);

// Apply JWT authentication for non-guest users
router.use((req, res, next) => {
  // Skip JWT auth for OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  // If user is already authenticated as guest, continue
  if (req.user?.isGuest) {
    return next();
  }
  
  // Otherwise, try to authenticate with JWT
  authenticateToken(req, res, next);
});

// All routes below this point will have either:
// - req.user with isGuest: true and guestId (for guests)
// - req.user with _id and other user properties (for authenticated users)

// @route   GET /api/todos/stats
// @desc    Get todo statistics
// @access  Private (supports both authenticated and guest users)
router.get('/stats', getTodoStats);

// @route   GET /api/todos
// @desc    Get all todos for user
// @access  Private (supports both authenticated and guest users)
router.get('/', getTodos);

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private (supports both authenticated and guest users)
router.post('/', createTodo);

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private (supports both authenticated and guest users)
router.get('/:id', getTodo);

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private (supports both authenticated and guest users)
router.put('/:id', updateTodo);

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private (supports both authenticated and guest users)
router.delete('/:id', deleteTodo);

module.exports = router;
