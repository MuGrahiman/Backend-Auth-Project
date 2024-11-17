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
