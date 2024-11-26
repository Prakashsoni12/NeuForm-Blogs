const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'user' },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    createdAt: { type: Date, default: Date.now },
    profileImage: { type: String, default: '/uploads/profiles' },
},{ timestamps: true });

module.exports = mongoose.model('User', UserSchema);


