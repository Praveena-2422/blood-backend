const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/donorLogin', userController.donorLogin);

// Protected routes
router.get('/getuser', authMiddleware, userController.getUser);
router.put('/updateuser', authMiddleware, userController.updateUser);
router.delete('/deleteuser', authMiddleware, userController.deleteUser);
router.get('/blood-groups', authMiddleware, userController.getBloodGroupCounts);

module.exports = router;
