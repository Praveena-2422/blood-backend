const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const ADMIN_USERNAME = '8098510184';
const ADMIN_PASSWORD = '123456';

// Login endpoint
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        // Check admin credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Create JWT token
            const token = jwt.sign(
                { userId: 'admin', role: 'admin' },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                status: 'success',
                token,
                user: {
                    id: 'admin',
                    username: username,
                    role: 'admin'
                }
            });
        }

        return res.status(401).json({
            status: 'error',
            message: 'Invalid credentials'
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

// Removed the duplicate catch block to fix the syntax error
