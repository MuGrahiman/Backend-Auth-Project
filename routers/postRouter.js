// Import necessary modules
const express = require('express'); // Import the Express library
const postController = require('../controllers/postController'); // Import the post controller
const { identifier } = require("../middlewares/identifier"); // Import the identifier middleware
const router = express.Router(); // Create a new router instance

// Define routes for post-related operations

// Route to get all posts
router.get('/all-posts', postController.getPosts);

// Route to get a single post
router.get('/single-post', postController.singlePost);

// Route to create a new post, with identifier middleware for authentication
router.post('/create-post', identifier, postController.createPost);

// Route to update an existing post, with identifier middleware for authentication
router.put('/update-post', identifier, postController.updatePost);

// Route to delete a post, with identifier middleware for authentication
router.delete('/delete-post', identifier, postController.deletePost);

// Export the router to be used in the main application
module.exports = router;  
