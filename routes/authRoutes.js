// /routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth', authController.getAuthUrl);  // Redirect to Azure login
router.get('/auth/callback', authController.handleAuthCallback);  // Handle callback

module.exports = router;
