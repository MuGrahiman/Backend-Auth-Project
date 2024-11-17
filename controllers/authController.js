const { signupSchema } = require("../middlewares/validator"); // Import validation schema
const userModel = require("../models/userModel"); // Import User model
const { doHash } = require("../utils/hash"); // Import hashing utility

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
