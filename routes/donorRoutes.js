const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const upload = require('../config/multer');
const { generateToken } = require('../config/jwt');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    req.donorId = decoded.donorId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get donor details using token
router.get('/me', verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findById(req.donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json({
      message: 'Donor details retrieved successfully',
      donor: {
        _id: donor._id,
        fullName: donor.fullName,
        mobileNumber: donor.mobileNumber,
        email: donor.email,
        dateOfBirth: donor.dateOfBirth,
        gender: donor.gender,
        bloodGroup: donor.bloodGroup,
        heightCm: donor.heightCm,
        weightKg: donor.weightKg,
        lastDonationDate: donor.lastDonationDate,
        eligibleToDonate: donor.eligibleToDonate,
        state: donor.state,
        district: donor.district,
        city: donor.city,
        area: donor.area,
        pinCode: donor.pinCode,
        preferredRadius: donor.preferredRadius,
        coordinates: donor.coordinates,
        healthIssues: donor.healthIssues,
        emergencyContactNumber: donor.emergencyContactNumber,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving donor details',
      error: error.message
    });
  }
});

const { body, validationResult } = require('express-validator');

// Register donor route
router.post('/register', 
  [
    // Personal Information validation
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('dateOfBirth').isDate().withMessage('Invalid date of birth format'),
    body('gender').trim().notEmpty().withMessage('Gender is required').isIn(['Male', 'Female', 'Other']),
    body('bloodGroup').trim().notEmpty().withMessage('Blood group is required').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('heightCm').isNumeric().withMessage('Height must be a number'),
    body('weightKg').isNumeric().withMessage('Weight must be a number'),

    // Blood Details validation
    body('lastDonationDate').optional().isDate().withMessage('Invalid last donation date format'),
    body('eligibleToDonate').isBoolean().withMessage('Eligible to donate must be a boolean value'),

    // Location Information validation
    body('state').trim().notEmpty().withMessage('State is required'),
    body('district').trim().notEmpty().withMessage('District is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('area').trim().notEmpty().withMessage('Area is required'),
    body('pinCode').trim().notEmpty().withMessage('Pin code is required'),

    // Additional Information validation
    body('existingHealthIssues').trim().notEmpty().withMessage('Health issues status is required').isIn(['Yes', 'No']),
    body('emergencyContactNumber').trim().notEmpty().withMessage('Emergency contact number is required'),
    body('agreedToTerms').isBoolean().withMessage('Terms acceptance is required'),

  ],
  async (req, res) => {
    try {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create donor object
      const donor = new Donor({
        ...req.body,
        idProof: req.file ? req.file.path : '',
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        }
      });

      // Save donor
      await donor.save();

      // Generate JWT token
      const token = generateToken(donor._id);

      // Return success response with token
      res.status(201).json({
        message: 'Donor registered successfully',
        token,
        donor: {
          _id: donor._id,
          fullName: donor.fullName,
          mobileNumber: donor.mobileNumber,
          email: donor.email,
          dateOfBirth: donor.dateOfBirth,
          gender: donor.gender,
          bloodGroup: donor.bloodGroup,
          height: donor.height,
          weight: donor.weight,
          lastDonationDate: donor.lastDonationDate,
          eligibleToDonate: donor.eligibleToDonate,
          state: donor.state,
          city: donor.city,
          area: donor.area,
          pinCode: donor.pinCode,
          preferredRadius: donor.preferredRadius,
          coordinates: donor.coordinates,
          healthIssues: donor.healthIssues,
          emergencyContactNumber: donor.emergencyContactNumber,
          profession: donor.profession,
          totalDonations: donor.totalDonations,
          about: donor.about,
          socialMediaLink: donor.socialMediaLink,
          termsAccepted: donor.termsAccepted,
          createdAt: donor.createdAt,
          updatedAt: donor.updatedAt
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error registering donor',
        error: error.message
      });
    }
  }
);

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find()
      .select('-idProof') // Don't include ID proof in response
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Donors retrieved successfully',
      donors: donors.map(donor => ({
        _id: donor._id,
        fullName: donor.fullName,
        mobileNumber: donor.mobileNumber,
        email: donor.email,
        dateOfBirth: donor.dateOfBirth,
        gender: donor.gender,
        bloodGroup: donor.bloodGroup,
        height: donor.height,
        weight: donor.weight,
        lastDonationDate: donor.lastDonationDate,
        eligibleToDonate: donor.eligibleToDonate,
        state: donor.state,
        city: donor.city,
        area: donor.area,
        pinCode: donor.pinCode,
        preferredRadius: donor.preferredRadius,
        coordinates: donor.coordinates,
        healthIssues: donor.healthIssues,
        emergencyContactNumber: donor.emergencyContactNumber,
        profession: donor.profession,
        totalDonations: donor.totalDonations,
        about: donor.about,
        socialMediaLink: donor.socialMediaLink,
        termsAccepted: donor.termsAccepted,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving donors',
      error: error.message
    });
  }
});

// Get donors filtered by blood group and location
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, state, city } = req.query;
    
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (state) query.state = state;
    if (city) query.city = city;

    const donors = await Donor.find(query)
      .select('-idProof')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Donors retrieved successfully',
      donors: donors.map(donor => ({
        _id: donor._id,
        fullName: donor.fullName,
        mobileNumber: donor.mobileNumber,
        email: donor.email,
        dateOfBirth: donor.dateOfBirth,
        gender: donor.gender,
        bloodGroup: donor.bloodGroup,
        height: donor.height,
        weight: donor.weight,
        lastDonationDate: donor.lastDonationDate,
        eligibleToDonate: donor.eligibleToDonate,
        state: donor.state,
        city: donor.city,
        area: donor.area,
        pinCode: donor.pinCode,
        preferredRadius: donor.preferredRadius,
        coordinates: donor.coordinates,
        healthIssues: donor.healthIssues,
        emergencyContactNumber: donor.emergencyContactNumber,
        profession: donor.profession,
        totalDonations: donor.totalDonations,
        about: donor.about,
        socialMediaLink: donor.socialMediaLink,
        termsAccepted: donor.termsAccepted,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving donors',
      error: error.message
    });
  }
});

module.exports = router;
