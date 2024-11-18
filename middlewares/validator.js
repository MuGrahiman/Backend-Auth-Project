const Joi = require('joi'); // Import Joi for validation

// Define signup validation Middleware
exports.signupSchema = Joi.object({
	email: Joi.string() // Email field
		.min(6) // Minimum length of 6 characters
		.max(60) // Maximum length of 60 characters
		.required() // Must be provided
		.email({ // Must be a valid email
			tlds: { allow: ['com', 'net'] }, // Allow specific top-level domains
		}),
	password: Joi.string() // Password field
		.required() // Must be provided
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')), // Must match criteria: at least 8 characters, one lowercase, one uppercase, and one digit
});


// Define signin validation schema
exports.signinSchema = Joi.object({
	email: Joi.string() // Email field
		.min(6) // Minimum length of 6 characters
		.max(60) // Maximum length of 60 characters
		.required() // Must be provided
		.email({ // Must be a valid email
			tlds: { allow: ['com', 'net'] }, // Allow specific top-level domains
		}),
	password: Joi.string() // Password field
		.required() // Must be provided
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')), // Must match criteria: at least 8 characters, one lowercase, one uppercase, and one digit
});

// Define accept code validation schema
exports.acceptCodeSchema = Joi.object({
	email: Joi.string() // Email field
		.min(6) // Minimum length of 6 characters
		.max(60) // Maximum length of 60 characters
		.required() // Must be provided
		.email({ // Must be a valid email
			tlds: { allow: ['com', 'net'] }, // Allow specific top-level domains
		}),
	providedCode: Joi.number() // Provided code field
		.required(), // Must be provided
});

// Define change password schema
exports.changePasswordSchema = Joi.object({
	newPassword: Joi.string() // Define newPassword as a string
		.required() // Make newPassword required
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')), // Must match criteria: at least 8 characters, one lowercase, one uppercase, and one digit
  
	oldPassword: Joi.string() // Define oldPassword as a string
		.required() // Make oldPassword required
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')), // Must match criteria: at least 8 characters, one lowercase, one uppercase, and one digit
});

// Define accept forgot password schema
exports.acceptFPCodeSchema = Joi.object({ // Define a Joi validation schema
	email: Joi.string() // Email field
		.min(6) // Minimum length of 6 characters
		.max(60) // Maximum length of 60 characters
		.required() // This field is required
		.email({ // Validate that the string is a valid email format
			tlds: { allow: ['com', 'net'] }, // Only allow specific top-level domains (TLDs)
		}),
	providedCode: Joi.number().required(), // Provided code field must be a number and is required
	newPassword: Joi.string() // New password field
		.required() // This field is required
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')), // Must match regex: at least 8 chars, at least one lowercase, one uppercase, and one digit
});

// Joi schema for validating the data required to create a post
exports.createPostSchema = Joi.object({
	title: Joi.string() // The title must be a string
		.min(3) // Minimum length of 3 characters
		.max(60) // Maximum length of 60 characters
		.required(), // Title is a required field

	description: Joi.string() // The description must be a string
		.min(3) // Minimum length of 3 characters
		.max(600) // Maximum length of 600 characters
		.required(), // Description is a required field

	userId: Joi.string() // The userId must be a string
		.required(), // userId is a required field
});
