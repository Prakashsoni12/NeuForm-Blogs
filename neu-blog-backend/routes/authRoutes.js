const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { profileUploader } = require('../middleware/fileUpload');


router.post('/register', profileUploader.single('profileImage'),  authController.register);
router.post('/login', authController.login);

module.exports = router;
