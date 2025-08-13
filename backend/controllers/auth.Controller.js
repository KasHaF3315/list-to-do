const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // This will be decoded later in middleware
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '12h' }
  );
};

// @desc Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Return token and user info
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Return token and user info
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get current logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // use req.user.userId from JWT
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getMe };
