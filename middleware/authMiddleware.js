const jwt = require('jsonwebtoken');

// decides who gets into protected routes and who gets kicked out, as it check if the user sent a valid JWT token
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized'});
        // 401 is unauthorized
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // attaching authenticated user's info to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token'});
    }
};

module.exports = requireAuth;