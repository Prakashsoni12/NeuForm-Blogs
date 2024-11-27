// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticate = require('../middleware/authMiddleware');
const { profileUploader } = require('../middleware/fileUpload');

router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/details/:id', authenticate, userController.getUserDetails);
router.put('/update', authenticate, profileUploader.single('profileImage'), userController.updateUser);
router.delete('/delete', authenticate, userController.deleteUser);

module.exports = router;
