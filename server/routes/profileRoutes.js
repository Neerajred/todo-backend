const express = require('express');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes below with JWT validation
router.use(authController.verifyToken);

// Get user profile
router.get('/', profileController.getProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Update user password
router.put('/password', profileController.updatePassword);

// Delete user profile
router.delete('/', profileController.deleteProfile);

module.exports = router;
