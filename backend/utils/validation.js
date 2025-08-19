const validator = require('validator');

// Validate email
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password strength
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate ObjectId
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateObjectId,
  sanitizeInput
};
