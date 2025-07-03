const { generateToken } = require('../config/jwt');
const { body, validationResult } = require('express-validator');
const Donor = require('../models/Donor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// OTP verification endpoint
exports.donorLogin = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;
        
        // Validate input
        if (!mobileNumber) {
            return res.status(400).json({
                statusCode: 400,
                status: 'error',
                message: 'Mobile number is required'
            });
        }

        // Default OTP if not provided
        const defaultOtp = '1111';
        const validOtp = otp || defaultOtp;

        // Check if OTP is correct
        if (validOtp === defaultOtp) {
            try {
                // Find donor by mobile number
                const donor = await Donor.findOne({ mobileNumber });
                
                if (!donor) {
                    return res.status(404).json({
                        statusCode: 404,
                        status: 'error',
                        message: 'Mobile number not found'
                    });
                }

                // Generate token
                const token = generateToken({
                    userId: donor._id,
                    role: 'user'
                });

                // Return success response
                return res.status(200).json({
                    statusCode: 200,
                    status: 'success',
                    message: 'Login successful',
                    data: {
                        token,
                        donor
                    }
                });
            } catch (error) {
                console.error('Error verifying OTP:', error);
                return res.status(500).json({
                    statusCode: 500,
                    status: 'error',
                    message: 'Internal server error'
                });
            }
        } else {
            return res.status(401).json({
                statusCode: 401,
                status: 'error',
                message: 'Invalid OTP'
            });
        }
    } catch (error) {
        console.error('Error in donorLogin:', error);
        return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Internal server error'
        });
    }
};

// User management endpoints
exports.getUser = async (req, res) => {
    try {
        console.log(req.user);
        const { userId } = req.user;

        const donor = await Donor.findById(userId).select('-password');
        if (!donor) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const donor = await Donor.findByIdAndUpdate(
            req.user.donorId.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!donor) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const donor = await Donor.findByIdAndDelete(req.user.donorId.userId);
        if (!donor) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hardcoded admin credentials
const ADMIN_USERNAME = '8098510184';
const ADMIN_PASSWORD = '123456';

// Get blood group counts


// Login endpoint
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
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
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: 'admin',
                    username: username,
                    role: 'admin'
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            mobileNumber,
            email,
            dateOfBirth,
            gender,
            bloodGroup,
            heightCm,
            weightKg,
            lastDonationDate,
            eligibleToDonate,
            state,
            city,
            area,
            pinCode,
            existingHealthIssues,
            emergencyContactNumber,
            agreedToTerms,
        } = req.body;

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if mobile number already exists
        const existingDonor = await Donor.findOne({ mobileNumber });
        if (existingDonor) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number is already registered'
            });
        }

        // Create donor object
        const data = new Donor({
            fullName,
            mobileNumber,
            email,
            dateOfBirth,
            gender,
            bloodGroup,
            heightCm,
            weightKg,
            lastDonationDate,
            eligibleToDonate,
            state,
            city,
            area,
            pinCode,
            existingHealthIssues,
            emergencyContactNumber,
            agreedToTerms
        });

        // Save donor
        await data.save();

        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Registered successfully',
            data: {
                _id: data._id,
                fullName: data.fullName,
                mobileNumber: data.mobileNumber,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                bloodGroup: data.bloodGroup,
                heightCm: data.heightCm,
                weightKg: data.weightKg,
                lastDonationDate: data.lastDonationDate,
                eligibleToDonate: data.eligibleToDonate,
                state: data.state,
                city: data.city,
                area: data.area,
                pinCode: data.pinCode,
                existingHealthIssues: data.existingHealthIssues,
                emergencyContactNumber: data.emergencyContactNumber,
                agreedToTerms: data.agreedToTerms,
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

