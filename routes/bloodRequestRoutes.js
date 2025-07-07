const express = require('express');
const router = express.Router();
const bloodRequestController = require('../controllers/bloodRequestController');

// Routes for blood requests
router.post('/', bloodRequestController.createRequest);
router.post('/add', bloodRequestController.addRequest); // New endpoint for admin
router.get('/', bloodRequestController.getAllRequests);
router.get('/:id', bloodRequestController.getRequest);
router.put('/:id/status', bloodRequestController.updateRequestStatus);
router.delete('/:id', bloodRequestController.deleteRequest);

module.exports = router;
