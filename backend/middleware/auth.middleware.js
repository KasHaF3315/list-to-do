const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Extract JWT token from request
 * 1. Check Authorization header (Bearer token)
 * 2. Check cookies
 * 3. Check query parameters
 */
const extractBearerToken = (req) => {
  // 1. Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }

  // 2. Check cookies (for web browsers)
  if (req.cookies && req.cookies['auth-token']) {
    return req.cookies['auth-token'];
  }

  // 3. Check query params (for mobile apps)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
};

/**
 * Authentication middleware
 * - Validates JWT tokens
 * - Handles guest authentication
 * - Attaches user info to request object
 */
const auth = (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    
    // No token provided - proceed as guest
    if (!token) {
      logger.debug('No authentication token provided, proceeding as guest');
      return next();
    }

    // Handle guest tokens (prefixed with 'guest-')
    if (token.startsWith('guest-')) {
      logger.debug('Guest token detected');
      req.user = { 
        _id: token, // Use the guest token as ID
        userId: token,
        isGuest: true,
        guestId: token
      };
      return next();
    }

    // Verify JWT token for authenticated users
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret);
      
      if (!decoded.userId) {
        logger.warn('JWT token missing userId');
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token format',
          message: 'Token does not contain user information'
        });
      }

      // Attach user info to request
      req.user = { 
        _id: decoded.userId, 
        userId: decoded.userId,
        isGuest: false,
        name: decoded.name,
        email: decoded.email
      };

      logger.debug(`Authenticated user: ${decoded.userId}`);
      return next();
      
    } catch (jwtError) {
      logger.warn('JWT verification failed', { error: jwtError.message });
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: 'Token expired',
          message: 'Your session has expired. Please login again.'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token',
          message: 'The provided token is invalid.'
        });
      }
      
      throw jwtError; // Re-throw for outer catch
    }
    
  } catch (error) {
    logger.error('Authentication error', { 
      error: error.message, 
      stack: error.stack,
      path: req.path,
      method: req.method
    });
    
    // Don't expose internal errors to client
    const errorResponse = {
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication.'
    };
    
    // Add more details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.message;
    }
    
    return res.status(500).json(errorResponse);
  }
};

/**
 * Require authentication middleware
 * Ensures the user is authenticated (not guest)
 */
const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.userId) {
    logger.warn('Unauthenticated access attempt', { path: req.path });
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please log in to access this resource.'
    });
  }
  next();
};

// Alias for backward compatibility
const authenticateToken = auth;

module.exports = { 
  auth, 
  authenticateToken,
  requireAuth 
};
