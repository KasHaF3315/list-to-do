const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  const originalEnd = res.end;
  res.end = function endWithLogging(chunk, encoding) {
    const durationMs = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    });
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = { requestLogger };
