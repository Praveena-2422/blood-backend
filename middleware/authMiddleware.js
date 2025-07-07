const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        console.log('Decoded token:', decoded);
        
        // Handle both admin and donor tokens
        if (decoded.adminId && decoded.role === 'admin') {
            // Admin token
            req.user = {
                userId: decoded.adminId,
                role: 'admin',
                adminId: decoded.adminId
            };
        } else if (decoded.donorId) {
            // Donor token
            req.user = {
                userId: decoded.donorId.userId || null,
                role: decoded.donorId.role || null,
            };
        } else if (decoded.userId && decoded.role) {
            // Direct user token
            req.user = {
                userId: decoded.userId,
                role: decoded.role
            };
        } else {
            return res.status(401).json({ message: 'Invalid token structure' });
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
