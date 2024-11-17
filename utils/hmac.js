const { createHmac } = require('crypto'); // Import createHmac from the crypto module

// HMAC processing function
exports.hmacProcess = (value, key) => {
	// Create an HMAC using SHA-256 algorithm with the provided key
	const result = createHmac('sha256', key) // Initialize HMAC with SHA-256
		.update(value) // Update HMAC with the input value
		.digest('hex'); // Generate the final HMAC hash in hexadecimal format
	return result; // Return the resulting HMAC hash
};
