const { createPostSchema } = require("../middlewares/validator");
const postModel = require("../models/postModel"); // Import Post model

// Controller to retrieve posts with pagination
exports.getPosts = async (req, res) => {
	const { page } = req.query; // Destructure the page number from the query parameters
	const postsPerPage = 10; // Define the number of posts per page

	try {
		let pageNum = 0; // Initialize the page number for database query
		// Calculate the page number for MongoDB skip
		if (page <= 1) {
			pageNum = 0; // If page is 1 or less, set to 0 (first page)
		} else {
			pageNum = page - 1; // For pages greater than 1, subtract 1 for zero-based index
		}

		// Query the database for posts, sorted by creation date, with pagination
		const result = await postModel.find()
			.sort({ createdAt: -1 }) // Sort posts by creation date in descending order
			.skip(pageNum * postsPerPage) // Skip the number of posts based on the current page
			.limit(postsPerPage) // Limit the number of posts returned to postsPerPage
			.populate({
				path: 'userId', // Populate the userId field with user data
				select: 'email', // Only select the email field from the user data
			});

		// Return the retrieved posts and a success message
		res.status(200).json({ success: true, message: 'posts', data: result });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to retrieve a single post by its ID
exports.singlePost = async (req, res) => {
	const { _id } = req.query; // Destructure the post ID from the query parameters

	try {
		// Find the post by its ID and populate the userId field with user email
		const existingPost = await postModel.findOne({ _id }).populate({
			path: 'userId', // Specify the field to populate
			select: 'email', // Only select the email field from the user data
		});
		
		// Check if the post exists
		if (!existingPost) {
			// If not found, return a 404 error with a message
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		
		// If the post is found, return it with a success message
		res
			.status(200)
			.json({ success: true, message: 'single post', data: existingPost });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to create a new post
exports.createPost = async (req, res) => {
	const { title, description } = req.body; // Destructure title and description from the request body
	const { userId } = req.user; // Get the user ID from the authenticated user

	try {
		// Validate the input data against the defined schema
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId,
		});
		
		// If validation fails, return a 401 error with the validation message
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		// Create a new post in the database with the provided data
		const result = await postModel.create({
			title,
			description,
			userId,
		});
		
		// Return a success response with the created post data
		res.status(201).json({ success: true, message: 'created', data: result });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to update an existing post
exports.updatePost = async (req, res) => {
	const { _id } = req.query; // Destructure the post ID from the query parameters
	const { title, description } = req.body; // Destructure title and description from the request body
	const { userId } = req.user; // Get the user ID from the authenticated user

	try {
		// Validate the input data against the defined schema
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId,
		});
		
		// If validation fails, return a 401 error with the validation message
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		// Find the existing post by its ID
		const existingPost = await postModel.findOne({ _id });
		
		// Check if the post exists
		if (!existingPost) {
			// If not found, return a 404 error with a message
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}

		// Check if the user is authorized to update the post
		if (existingPost.userId.toString() !== userId) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}

		// Update the post's title and description
		existingPost.title = title;
		existingPost.description = description;

		// Save the updated post to the database
		const result = await existingPost.save();
		
		// Return a success response with the updated post data
		res.status(200).json({ success: true, message: 'Updated', data: result });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};

// Controller to delete an existing post
exports.deletePost = async (req, res) => {
	const { _id } = req.query; // Destructure the post ID from the query parameters
	const { userId } = req.user; // Get the user ID from the authenticated user

	try {
		// Find the existing post by its ID
		const existingPost = await postModel.findOne({ _id });
		
		// Check if the post exists
		if (!existingPost) {
			// If not found, return a 404 error with a message
			return res
				.status(404)
				.json({ success: false, message: 'Post already unavailable' });
		}

		// Check if the user is authorized to delete the post
		if (existingPost.userId.toString() !== userId) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}

		// Delete the post from the database
		await postModel.deleteOne({ _id });
		
		// Return a success response indicating the post has been deleted
		res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error);
	}
};
