const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  personalDetails: {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String },
    relationshipToPatient: { type: String, required: true },
    patientAge: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }
  },
  bloodRequirementDetails: {
    requiredBloodGroup: { type: String, required: true },
    unitsNeeded: { type: Number, required: true },
    neededOn: { type: Date, required: true },
    isEmergency: { type: Boolean, required: true },
    reasonForRequest: { type: String, required: true },
    hospitalName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    hospitalAddress: { type: String, required: true },
    doctorReferenceName: { type: String }
  },
  locationDetails: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    pinCode: { type: String, required: true },
    currentLocation: { type: String, required: true }
  },
  additionalInformation: {
    patientId: { type: String },
    ongoingTreatment: { type: Boolean, required: true },
    uploadDoctorNote: { type: String }, // Store file path or URL
    termsAccepted: { type: Boolean, required: true }
  },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'completed'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
module.exports = BloodRequest;
