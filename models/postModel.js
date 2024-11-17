const mongoose = require('mongoose');

// Define post schema
const postSchema = mongoose.Schema(
	{
		title: {
			type: String, // Post title
			required: [true, 'Title is required!'], // Must be provided
			trim: true, // Remove whitespace
		},
		description: {
			type: String, // Post description
			required: [true, 'Description is required!'], // Must be provided
			trim: true, // Remove whitespace
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Reference to User model
			ref: 'User', // Reference name
			required: true, // Must be provided
		},
	},
	{ timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the Post model
module.exports = mongoose.model('Post', postSchema);
