const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.identifier = (req, res, next) => {
	let token;

	// Get token based on client type
	if (req.headers.client === 'not-browser') {
		token = req.headers.authorization; // Non-browser client
	} else {
		token = req.cookies['Authorization']; // Browser client
	}

	// Check if token is missing
	if (!token) {
		return res.status(403).json({ success: false, message: 'Unauthorized' }); // Unauthorized response
	}

	try {
		const userToken = token.split(' ')[1]; // Extract token part
		const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET); // Verify token
		if (jwtVerified) {
			req.user = jwtVerified; // Attach user info to request
			next(); // Proceed to next middleware
		} else {
			throw new Error('error in the token'); // Token verification failed
		}
	} catch (error) {
		console.error(error); // Log any error
	}
};
