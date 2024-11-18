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
