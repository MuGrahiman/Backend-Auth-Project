const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

router.get('/all-posts', postController.getPosts);
router.get('/single-post', postController.singlePost);

module.exports = router;