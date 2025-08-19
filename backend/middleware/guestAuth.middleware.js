const jwt = require('jsonwebtoken');

const extractBearerToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return null;
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return null;
    return token;
};

const guestAuth = (req, res, next) => {
    const token = extractBearerToken(req);

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Check if it's a guest token
        if (token.includes('guest-signature')) {
            // For guest users, we'll create a mock user object
            req.user = {
                _id: 'guest',
                userId: 'guest',
                isGuest: true
            };
            return next();
        }

        // Regular JWT verification for authenticated users
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId || decoded.id;
        req.user = { _id: userId, userId, isGuest: false };
        return next();

    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { guestAuth };
