// Standard response format utility
const sendResponse = (res, statusCode, success, data = null, message = null) => {
  const response = {
    success,
    ...(message && { message }),
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
};

// Success responses
const sendSuccess = (res, data, message = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, data, message);
};

// Error responses
const sendError = (res, message, statusCode = 500, data = null) => {
  return sendResponse(res, statusCode, false, data, message);
};

// Created response
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendResponse(res, 201, true, data, message);
};

// Not found response
const sendNotFound = (res, message = 'Resource not found') => {
  return sendResponse(res, 404, false, null, message);
};

// Validation error response
const sendValidationError = (res, message = 'Validation failed') => {
  return sendResponse(res, 400, false, null, message);
};

// Unauthorized response
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendResponse(res, 401, false, null, message);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendValidationError,
  sendUnauthorized
};
