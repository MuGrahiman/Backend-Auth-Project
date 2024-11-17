const express = require("express"); // Import Express framework
const authController = require("../controllers/authController"); // Import auth controller

const router = express.Router(); // Create a new router instance

// Define route for user signup
router.post("/signup", authController.signup); // Handle POST request for signup
router.post("/sign-in", authController.signIn); // Handle POST request for sign-in
router.post("/sign-out", authController.signOut); // Handle POST request for sign-out
// Handle PATCH request for send-verification-code
router.patch(
  "/send-verification-code",
  authController.sendVerificationCode
);
module.exports = router; // Export the router
