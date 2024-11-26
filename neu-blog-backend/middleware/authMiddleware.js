const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log("this is token: ",token)
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log decoded token
        console.log("decoded user_id: ",{...decoded})
        req.userId = decoded.userId; // Attach user ID to the request object
        console.log(req.userId)
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
module.exports = authenticate;