const { hash, compare } = require('bcryptjs'); // Import bcryptjs functions

// Function to hash a value
exports.doHash = (value, saltValue) => {
	const result = hash(value, saltValue); // Hash the value with the specified salt
	return result; // Return the hashed result
};


// Function to validate a value against a hashed value
exports.doHashValidation = (value, hashedValue) => {
	const result = compare(value, hashedValue); // Compare the plain value with the hashed value
	return result; // Return the comparison result (true or false)
};
