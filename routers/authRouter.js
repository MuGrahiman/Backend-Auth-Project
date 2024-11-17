const express = require('express'); // Import Express framework
const authController = require('../controllers/authController'); // Import auth controller

const router = express.Router(); // Create a new router instance

// Define route for user signup
router.post('/signup', authController.signup); // Handle POST request for signup
router.post('/signin', authController.signIn); // Handle POST request for signin

module.exports = router; // Export the router
