const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to handle guest users robustly.
 * Treats missing OR invalid Authorization headers as guest sessions.
 */
const guestAuth = (req, res, next) => {
  if (!req.user) {
    req.user = {};
  }

  const authHeader = req.headers.authorization || '';

  // Extract bearer token if present
  let token = null;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // Consider these as "no real token"
  const invalidTokens = new Set(['', 'null', 'undefined', 'NaN', '""', "''"]);
  const hasValidToken = token && !invalidTokens.has(String(token).trim());

  // If there is no valid token, ensure a guest identity exists
  if (!hasValidToken) {
    const existingGuestId = req.cookies?.guestId;
    const guestId = existingGuestId || `guest_${uuidv4()}`;

    if (!existingGuestId) {
      res.cookie('guestId', guestId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // devtunnels require cross-site cookies without secure in http contexts
        sameSite: 'none', // allow cross-origin cookie for devtunnel
      });
    }

    req.user.isGuest = true;
    req.user.guestId = guestId;
  }

  return next();
};

module.exports = guestAuth;
