const BloodRequest = require('../models/BloodRequest');

// Create new blood request
exports.createRequest = async (req, res) => {
  try {
    const bloodRequest = new BloodRequest(req.body);
    await bloodRequest.save();
    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: bloodRequest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add new blood request (specific endpoint for admin)
exports.addRequest = async (req, res) => {
  try {
    const {
      requesterDetails,
      personalDetails,
      bloodRequirementDetails,
      locationDetails,
      additionalInformation
    } = req.body;

    // Validate required fields
    if (!requesterDetails?.requesterId || !personalDetails?.fullName || !bloodRequirementDetails?.requiredBloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: requester, personal details, or blood group'
      });
    }

    // Create the blood request with additional requester information
    const bloodRequestData = {
      requesterDetails,
      personalDetails,
      bloodRequirementDetails,
      locationDetails,
      additionalInformation,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const bloodRequest = new BloodRequest(bloodRequestData);
    await bloodRequest.save();

    res.status(201).json({
      success: true,
      message: 'Blood request added successfully',
      data: bloodRequest
    });
  } catch (error) {
    console.error('Error adding blood request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add blood request',
      error: error.message
    });
  }
};

// Get all blood requests
exports.getAllRequests = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bloodRequests
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single blood request by ID
exports.getRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }
    res.status(200).json({
      success: true,
      data: bloodRequest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update blood request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }
    bloodRequest.status = req.body.status;
    bloodRequest.updatedAt = new Date();
    await bloodRequest.save();
    res.status(200).json({
      success: true,
      message: 'Blood request status updated successfully',
      data: bloodRequest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete blood request
exports.deleteRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
