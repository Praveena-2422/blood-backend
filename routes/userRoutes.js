const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const blooddashboardController = require('../controllers/blooddashboardController');
const campRoutes = require('../routes/campRoutes');

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/donorLogin', userController.donorLogin);
router.get('/getAllUser', userController.getAllUser);

// Protected routes
router.get('/getuser', authMiddleware, userController.getUser);
router.put('/updateuser', authMiddleware, userController.updateUser);
router.delete('/deleteuser', authMiddleware, userController.deleteUser);

// Blood dashboard routes
router.get('/blood-groups', authMiddleware, blooddashboardController.getBloodGroupCounts);
// app.use('/api/requester', bloodRequestRoutes);
router.get('/camps', campRoutes);

module.exports = router;
