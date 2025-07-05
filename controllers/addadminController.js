
const { validationResult } = require('express-validator');
const AddAdmin = require('../models/addadmin');



exports.addAdmin = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if email already exists
        const existingEmail = await AddAdmin.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Check if mobile number already exists
        const existingPhone = await AddAdmin.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number is already registered'
            });
        }

        // Create donor object
        const data = new AddAdmin({
            name,
            email,
            phone,
            address,
        });

        // Save donor
        await data.save();

        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Registered successfully',
            data: {
                _id: data._id,
                name: data.name,
                phone: data.phone,
                email: data.email,
                address: data.address,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        });
    } catch (error) {
        console.log({ error });
        res.status(500).json({
            success: false,
            message: 'Error registering donor',
            error: error.message
        });
    }
};  