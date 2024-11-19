const express = require('express');
const postController = require('../controllers/postController');
const { identifier } = require("../middlewares/identifier");
const router = express.Router();

router.get('/all-posts', postController.getPosts);
router.get('/single-post', postController.singlePost);
router.post('/create-post', identifier, postController.createPost);
router.put('/update-post', identifier, postController.updatePost);

module.exports = router; 