const mongoose = require("mongoose");

// Define user schema
const userSchema = mongoose.Schema(
  {
    email: {
      type: String, // Email address
      required: [true, "Email is required!"], // Must be provided
      trim: true, // Remove whitespace
      unique: [true, "Email must be unique!"], // Must be unique
      minLength: [5, "Email must have 5 characters!"], // Minimum length
      lowercase: true, // Convert to lowercase
    },
    password: {
      type: String, // User password
      required: [true, "Password must be provided!"], // Must be provided
      trim: true, // Remove whitespace
      select: false, // Exclude from query results
    },
    verified: {
      type: Boolean, // Verification status
      default: false, // Default to false
    },
    verificationCode: {
      type: String, // Code for email verification
      select: false, // Exclude from query results
    },
    verificationCodeValidation: {
      type: Number, // Code validation expiration time
      select: false, // Exclude from query results
    },
    forgotPasswordCode: {
      type: String, // Code for password reset
      select: false, // Exclude from query results
    },
    forgotPasswordCodeValidation: {
      type: Number, // Password reset code expiration time
      select: false, // Exclude from query results
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the User model
module.exports = mongoose.model("User", userSchema);
