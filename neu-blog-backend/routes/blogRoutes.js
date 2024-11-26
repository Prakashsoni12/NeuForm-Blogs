const express = require('express');
const path = require('path');

const router = express.Router();
const blogController = require('../controller/blogController');
const authenticate = require('../middleware/authMiddleware');
const validateBlog = require('../middleware/validateblog');
const { thumbnailUploader } = require('../middleware/fileUpload');


//Debugging Logs for testing purpose
// console.log('authenticate:', typeof authenticate);
// console.log('validateBlog:', typeof validateBlog);
// console.log('blogController.createBlog:', typeof blogController.createBlog);

// Routes
router.post(
    '/create',
    authenticate,
    thumbnailUploader.single('thumbnail'), // Middleware for file handling
    validateBlog,           
    blogController.createBlog   
);
router.get('/recent', blogController.getRecentBlogs); // Fetch recent blogs
router.get('/user', authenticate, blogController.getUserBlogs); // Fetch blogs by logged-in user
router.get('/all', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', authenticate, blogController.updateBlog);
router.delete('/delete/:id', authenticate, blogController.deleteBlog);

module.exports = router;
