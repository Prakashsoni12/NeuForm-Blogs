const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user API
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const DEFAULT_PROFILE_IMAGE = `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`;
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` :  DEFAULT_PROFILE_IMAGE ;

    console.log("This is user id from authController: ",req.userId)
    try {
       //Check if the user already exists
       const existingUser = await User.findOne({ email });
       if (existingUser) {
           return res.status(400).json({ error: 'User already registered' });
       }
       //password Hashing 
       const hashedPassword = await bcrypt.hash(password, 10);

       //Create and save new user
       const newUser = new User({ name, email, password: hashedPassword,role,profileImage, });
       await newUser.save();

       res.status(201).json({ message: 'User registered successfully',
        user: {
            ...newUser.toObject(),
            profileImage: `${req.protocol}://${req.get('host')}${profileImage}`, // Full public URL
        },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Login APi
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found. Registration required.' });
        }
    
        //password verification.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        //Generate JWT token for password
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const profileImageUrl = `${req.protocol}://${req.get('host')}${user.profileImage}`;

        console.log('Generated Token Payload:', { userId: user._id });
        res.status(200).json({ message: 'Login successful', token, 
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: profileImageUrl,
            }
             });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
