const jwt = require('jsonwebtoken');
const AddAdmin = require('../models/addadmin');

exports.adminLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        // Default password for all admins
        const DEFAULT_PASSWORD = '1111';

        // Check if admin exists
        const admin = await AddAdmin.findOne({ phone });
        
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Check password
        if (password !== DEFAULT_PASSWORD) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { adminId: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                name: admin.name,
                phone: admin.phone,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
