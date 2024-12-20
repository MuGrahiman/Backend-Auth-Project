const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptFPCodeSchema } = require("../middlewares/validator"); // Import validation schema
const userModel = require("../models/userModel"); // Import User model
const { doHash,doHashValidation } = require("../utils/hash"); // Import hashing utilities
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const transporter = require("../middlewares/nodeMailer");
const { hmacProcess } = require('../utils/hmac'); // Import HMAC processing utility

 
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


// Send verification code controller
exports.sendVerificationCode = async (req, res) => {
	const { email } = req.body; // Destructure email from request body
	try {
		// Check if the user exists in the database
		const existingUser = await userModel.findOne({ email });
		if (!existingUser) {
			// If user does not exist, return 404 error
			return res
				.status(404)
				.json({ success: false, message: 'User does not exist!' });
		}
		if (existingUser.verified) {
			// If user is already verified, return 400 error
			return res
				.status(400)
				.json({ success: false, message: 'You are already verified!' });
		}

		// Generate a random 6-digit verification code
		const codeValue = Math.floor(Math.random() * 1000000).toString();
		console.log("🚀 ~ exports.sendVerificationCode= ~ codeValue:", codeValue)
		// Send the verification code via email
		let info = await transporter.sendMail({
			from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Sender's email address
			to: existingUser.email, // Recipient's email address
			subject: 'Verification Code', // Email subject
			html: '<h1>' + codeValue + '</h1>', // Email body containing the verification code
		});

		// Check if the email was successfully sent
		if (info.accepted[0] === existingUser.email) {
			// Hash the verification code and save it to the user's record
			const hashedCodeValue = hmacProcess(
				codeValue,
				process.env.HMAC_VERIFICATION_CODE_SECRET
			);
			existingUser.verificationCode = hashedCodeValue; // Store hashed code
			existingUser.verificationCodeValidation = Date.now(); // Store timestamp for code validation
			await existingUser.save(); // Save changes to the user record
			return res.status(200).json({ success: true, message: 'Code sent!' }); // Return success response
		}
		// If email sending fails, return 400 error
		res.status(400).json({ success: false, message: 'Code sending failed!' });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to verify the provided verification code
exports.verifyVerificationCode = async (req, res) => {
	const { email, providedCode } = req.body; // Destructure email and provided code from request body
	try {
		// Validate the provided email and code against the defined schema
		const { error, value } = acceptCodeSchema.validate({ email, providedCode });
		if (error) {
			// If validation fails, return 401 with error message
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const codeValue = providedCode.toString(); // Convert provided code to string
		// Find the existing user with the provided email, including verification fields
		const existingUser = await userModel.findOne({ email }).select(
			'+verificationCode +verificationCodeValidation'
		);

		if (!existingUser) {
			// If user does not exist, return 401 error
			return res
				.status(401)
				.json({ success: false, message: 'User does not exist!' });
		}
		if (existingUser.verified) {
			// If user is already verified, return 400 error
			return res
				.status(400)
				.json({ success: false, message: 'You are already verified!' });
		}

		// Check if verification code or validation timestamp is missing
		if (
			!existingUser.verificationCode ||
			!existingUser.verificationCodeValidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'Something is wrong with the code!' });
		}

		// Check if the verification code has expired (5 minutes)
		if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
			return res
				.status(400)
				.json({ success: false, message: 'Code has expired!' });
		}

		// Hash the provided code using HMAC for comparison
		const hashedCodeValue = hmacProcess(
			codeValue,
			process.env.HMAC_VERIFICATION_CODE_SECRET
		);

		// Compare the hashed code with the stored verification code
		if (hashedCodeValue === existingUser.verificationCode) {
			// If codes match, update user status to verified and clear verification fields
			existingUser.verified = true;
			existingUser.verificationCode = undefined;
			existingUser.verificationCodeValidation = undefined;
			await existingUser.save(); // Save the updated user record
			return res
				.status(200)
				.json({ success: true, message: 'Your account has been verified!' });
		}
		// If codes do not match, return 400 error
		return res
			.status(400)
			.json({ success: false, message: 'Unexpected error occurred!' });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to change password
exports.changePassword = async (req, res) => {
	const { userId, verified } = req.user; // Get user ID and verification status
	const { oldPassword, newPassword } = req.body; // Get old and new passwords

	try {
		// Validate passwords against schema
		const { error, value } = changePasswordSchema.validate({
			oldPassword,
			newPassword,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message }); // Validation error
		}
		if (!verified) {
			return res
				.status(401)
				.json({ success: false, message: 'You are not verified user!' }); // Not verified
		}
		const existingUser = await userModel.findOne({ _id: userId }).select(
			'+password' // Find user with password
		);
		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' }); // User not found
		}
		const result = await doHashValidation(oldPassword, existingUser.password); // Validate old password
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' }); // Invalid old password
		}
		const hashedPassword = await doHash(newPassword, 12); // Hash new password
		existingUser.password = hashedPassword; // Update user's password
		await existingUser.save(); // Save changes
		return res
			.status(200)
			.json({ success: true, message: 'Password updated!!' }); // Success response
	} catch (error) {
		console.error(error); // Log error
	}
};

// Controller to send forgot password code
exports.sendForgotPasswordCode = async (req, res) => {
	const { email } = req.body; // Get email from request body
	try {
		const existingUser = await userModel.findOne({ email }); // Find user by email
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: 'User does not exists!' }); // User not found
		}

		const codeValue = Math.floor(Math.random() * 1000000).toString(); // Generate random code
		console.log("🚀 ~ exports.sendForgotPasswordCode= ~ codeValue:", codeValue)
		let info = await transporter.sendMail({ // Send email with code
			from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
			to: existingUser.email,
			subject: 'Forgot password code',
			html: '<h1>' + codeValue + '</h1>',
		});

		if (info.accepted[0] === existingUser.email) { // Check if email was successfully sent
			const hashedCodeValue = hmacProcess( // Hash the code for verification
				codeValue,
				process.env.HMAC_VERIFICATION_CODE_SECRET
			);
			existingUser.forgotPasswordCode = hashedCodeValue; // Store hashed code
			existingUser.forgotPasswordCodeValidation = Date.now(); // Set code validation timestamp
			await existingUser.save(); // Save changes to user
			return res.status(200).json({ success: true, message: 'Code sent!' }); // Success response
		}
		res.status(400).json({ success: false, message: 'Code sent failed!' }); // Failure response
	} catch (error) {
		console.error(error); // Log error
	}
};

// Controller to verify forgot password code
exports.verifyForgotPasswordCode = async (req, res) => {
	const { email, providedCode, newPassword } = req.body; // Extract email, code, and new password from request
	try {
		const { error, value } = acceptFPCodeSchema.validate({ // Validate input against schema
			email,
			providedCode,
			newPassword,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message }); // Validation error
		}

		const codeValue = providedCode.toString(); // Convert provided code to string
		const existingUser = await userModel.findOne({ email }).select( // Find user and select relevant fields
			'+forgotPasswordCode +forgotPasswordCodeValidation'
		);

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' }); // User not found
		}

		if ( // Validate existence of the code and timestamp
			!existingUser.forgotPasswordCode ||
			!existingUser.forgotPasswordCodeValidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'something is wrong with the code!' }); // Code or validation time missing
		}

		if ( // Check if the code has expired (5 minutes)
			Date.now() - existingUser.forgotPasswordCodeValidation >
			5 * 60 * 1000
		) {
			return res
				.status(400)
				.json({ success: false, message: 'code has been expired!' }); // Code expired
		}

		const hashedCodeValue = hmacProcess( // Hash the provided code for verification
			codeValue,
			process.env.HMAC_VERIFICATION_CODE_SECRET
		);

		if (hashedCodeValue === existingUser.forgotPasswordCode) { // Check if the hashed code matches
			const hashedPassword = await doHash(newPassword, 12); // Hash the new password
			existingUser.password = hashedPassword; // Update user's password
			existingUser.forgotPasswordCode = undefined; // Clear forgot password code
			existingUser.forgotPasswordCodeValidation = undefined; // Clear validation timestamp
			await existingUser.save(); // Save user changes
			return res
				.status(200)
				.json({ success: true, message: 'Password updated!!' }); // Success response
		}
		return res
			.status(400)
			.json({ success: false, message: 'unexpected occurred!!' }); // Code mismatch
	} catch (error) {
		console.error(error); // Log any errors
	}
};
