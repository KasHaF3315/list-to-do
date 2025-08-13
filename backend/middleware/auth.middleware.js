const jwt = require('jsonwebtoken');

const extractBearerToken = (req) => {
  // Check Authorization header first
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }

  // Check cookies as fallback (for web browsers)
  if (req.cookies && req.cookies['auth-token']) {
    return req.cookies['auth-token'];
  }

  // Check query parameter as fallback (for mobile apps)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
};

const auth = (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No valid token provided'
      });
    }

    // Handle guest tokens
    if (token.startsWith('guest-token-')) {
      req.user = { 
        _id: 'guest', 
        userId: 'guest',
        isGuest: true 
      };
      return next();
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // Extract user information
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ 
        error: 'Invalid token format',
        message: 'Token does not contain user information'
      });
    }

    // Set user information in request
    req.user = { 
      _id: userId, 
      userId,
      isGuest: false,
      name: decoded.name,
      email: decoded.email
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid.'
      });
    }

    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication.'
    });
  }
};

const authenticateToken = auth;

module.exports = { auth, authenticateToken };
