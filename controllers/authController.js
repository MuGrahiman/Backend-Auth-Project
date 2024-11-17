const { signupSchema, signinSchema } = require("../middlewares/validator"); // Import validation schema
const userModel = require("../models/userModel"); // Import User model
const { doHash,doHashValidation } = require("../utils/hash"); // Import hashing utilities
const jwt = require('jsonwebtoken'); // Import JWT for token generation


// Signup controller
exports.signup = async (req, res) => {
	const { email, password } = req.body; // Destructure email and password from request body
	try {
		// Validate input data against the signup schema
		const { error, value } = signupSchema.validate({ email, password });

		if (error) {
			// If validation fails, return error response
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		// Check if the user already exists
		const existingUser = await userModel.findOne({ email });

		if (existingUser) {
			// If user exists, return error response
			return res
				.status(401)
				.json({ success: false, message: 'User already exists!' });
		}

		// Hash the password before saving
		const hashedPassword = await doHash(password, 12);

		// Create a new user instance
		const newUser = new userModel({
			email,
			password: hashedPassword,
		});

		// Save the new user to the database
		const result = await newUser.save();
		result.password = undefined; // Exclude password from response

		// Return success response
		res.status(201).json({
			success: true,
			message: 'Your account has been created successfully',
			result,
		});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
	}
};

// Sign in controller
exports.signIn = async (req, res) => {
	const { email, password } = req.body; // Destructure email and password from request body
	try {
		// Validate input data against the signin schema
		const { error, value } = signinSchema.validate({ email, password });
		if (error) {
			// If validation fails, return error response
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		// Check if the user exists and retrieve the hashed password
		const existingUser = await userModel.findOne({ email }).select('+password');
		if (!existingUser) {
			// If user does not exist, return error response
			return res
				.status(401)
				.json({ success: false, message: 'User does not exist!' });
		}

		// Validate the provided password against the hashed password
		const result = await doHashValidation(password, existingUser.password);
		if (!result) {
			// If password validation fails, return error response
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}

		// Generate JWT token for the authenticated user
		const token = jwt.sign(
			{
				userId: existingUser._id,
				email: existingUser.email,
				verified: existingUser.verified,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '8h', // Token expiration time
			}
		);

		// Set the token in a cookie and return success response
		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000), // Cookie expiration
				httpOnly: process.env.NODE_ENV === 'production', // Secure cookie in production
				secure: process.env.NODE_ENV === 'production', // Use secure flag in production
			})
			.json({
				success: true,
				token, // Include the token in the response
				message: 'Logged in successfully',
			});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
	}
};

// Sign-out controller
exports.signOut = async (req, res) => {
	// Clear the 'Authorization' cookie and send a success response
	res
		.clearCookie('Authorization') // Clear the cookie to log the user out
		.status(200) // Set HTTP status to 200 (OK)
		.json({ success: true, message: 'Logged out successfully' }); // Return success message in JSON format
};
