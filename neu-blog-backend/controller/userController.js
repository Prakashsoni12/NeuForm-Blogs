const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('blogs');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//get the user details 
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const userId = req.userId; // Get userId from authenticate middleware
        console.log('User ID:', userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('blogs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const updates = { name: req.body.name, email: req.body.email };
        if (req.file) updates.profileImage = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
