const express = require("express"); // Import Express framework
const authController = require("../controllers/authController"); // Import auth controller
const { identifier } = require("../middlewares/identifier");

const router = express.Router(); // Create a new router instance

// Define route for user signup
router.post("/signup", authController.signup); // Handle POST request for signup

router.post("/sign-in", authController.signIn); // Handle POST request for sign-in

router.post("/sign-out", identifier, authController.signOut); // Handle POST request for sign-out

// Handle PATCH request for send-verification-code
router.patch(
  identifier,
  "/send-verification-code",
  identifier,
  authController.sendVerificationCode
);

// Handle PATCH request for verifying-verification-code
router.patch(
  "/verify-verification-code",
  identifier,
  authController.verifyVerificationCode
);

module.exports = router; // Export the router
