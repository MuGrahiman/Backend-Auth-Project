const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails

// Create a transport object for sending emails using Gmail
const transport = nodemailer.createTransport({
	service: 'gmail', // Specify the email service provider
	auth: {
		user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Sender's email address from environment variables
		pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD, // Sender's email password from environment variables
	},
});

module.exports = transport; // Export the transport object for use in other modules
