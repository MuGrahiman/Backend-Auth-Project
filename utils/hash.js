const { hash } = require('bcryptjs'); // Import hash function from bcryptjs

// Function to hash a value
exports.doHash = (value, saltValue) => {
	const result = hash(value, saltValue); // Hash the value with the specified salt
	return result; // Return the hashed result
};
