const validateBlog = (req, res, next) => {
    console.log('req.body:', req.body); // Debug log
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }
    next();
};

module.exports = validateBlog;
