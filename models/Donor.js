const mongoose = require('mongoose');
const { Schema } = mongoose;

const donorSchema = new Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  heightCm: {
    type: Number,
    required: true
  },
  weightKg: {
    type: Number,
    required: true
  },

  // Blood Details
  lastDonationDate: {
    type: Date
  },
  eligibleToDonate: {
    type: Boolean,
    required: true
  },

  // Location Information
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true
  },

  // Additional Information
  existingHealthIssues: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  emergencyContactNumber: {
    type: String,
    required: true,
    trim: true
  },
  agreedToTerms: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // System Fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation for age (must be at least 18 years old)
donorSchema.path('dateOfBirth').validate(function(value) {
  const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 18;
}, 'Age must be at least 18 years old');

// Add validation for mobile number format
donorSchema.path('mobileNumber').validate(function(value) {
  return /^[6-9]\d{9}$/.test(value);
}, 'Invalid mobile number format');

// Add validation for pin code format
donorSchema.path('pinCode').validate(function(value) {
  return /^[1-9]\d{5}$/.test(value);
}, 'Invalid pin code format');

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
