const express = require("express"); // Import Express framework
const authController = require("../controllers/authController"); // Import auth controller
const { identifier } = require("../middlewares/identifier");

const router = express.Router(); // Create a new router instance

// Define route for user signup
router.post("/sign-up", authController.signup); // Handle POST request for signup

router.post("/sign-in", authController.signIn); // Handle POST request for sign-in

router.post("/sign-out", identifier, authController.signOut); // Handle POST request for sign-out

// Handle PATCH request for send-verification-code
router.patch(
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

// Handle PATCH request for change password
router.patch("/change-password", identifier, authController.changePassword);

// Handle PATCH send forgot password code
router.patch(
	'/send-forgot-password-code',
	authController.sendForgotPasswordCode
);

// Handle PATCH verify forgot password code
router.patch(
	'/verify-forgot-password-code',
	authController.verifyForgotPasswordCode
);
module.exports = router; // Export the router
