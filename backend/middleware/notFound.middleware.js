const logger = require('../config/logger');

const notFound = (req, res, _next) => {
  logger.warn('404 - Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    message: 'The requested resource does not exist on this server'
  });
};

module.exports = { notFound };
