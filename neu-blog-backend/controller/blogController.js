const Blog = require('../models/Blog');
const User = require('../models/User');

// Create a blog
exports.createBlog = async (req, res) => {
    const { title, content } = { ...req.body };
    const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;
    console.log(req.userId)
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    try {
        //Create a new blog instance
        const newBlog = new Blog({
            title,
            content,
            thumbnail,
            createdBy: req.userId, 
        });

        // Save the blog to the database
        await newBlog.save();

        //Link the blog to the user
        //Add blog ID to the user's blogs list
        const user = await User.findById(req.userId);
        user.blogs.push(newBlog._id);
        await user.save();

        //Send success response
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
};


exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('blogs', 'title content thumbnail');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};

//Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy', 'name email profileImage');

        //Add full paths for profile images and thumbnails
        const blogsWithFullPaths = blogs.map((blog) => ({
            ...blog.toObject(), // Convert Mongoose document to plain JavaScript object
            thumbnail: blog.thumbnail
                ? `${req.protocol}://${req.get('host')}${blog.thumbnail}`
                : `${req.protocol}://${req.get('host')}/uploads/defaults/Set-Default-Featured-Image.jpg`, // Default thumbnail path
            createdBy: blog.createdBy
                ? {
                      ...blog.createdBy.toObject(),
                      profileImage: blog.createdBy.profileImage
                          ? `${req.protocol}://${req.get('host')}${blog.createdBy.profileImage}`
                          : `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`, // Default profile image path
                  }
                : {
                      name: 'Unknown User',
                      profileImage: `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`, // Default profile for unknown users
                  },
        }));

        res.status(200).json({ blogs: blogsWithFullPaths });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: error.message });
    }
};


//Get blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy', 'name email');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        const fullThumbnailPath = blog.thumbnail
            ? `${req.protocol}://${req.get('host')}${blog.thumbnail}`
            : `${req.protocol}://${req.get('host')}/uploads/defaults/Set-Default-Featured-Image.jpg`;

        const fullProfileImagePath = blog.createdBy?.profileImage
            ? `${req.protocol}://${req.get('host')}${blog.createdBy.profileImage}`
            : `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`;

        const response = {
            ...blog.toObject(),
            thumbnail: fullThumbnailPath,
            createdBy: {
                ...blog.createdBy.toObject(),
                profileImage: fullProfileImagePath,
            },
        };

        res.status(200).json(response);
      
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

//Update blog
exports.updateBlog = async (req, res) => {
    const { title, content, thumbnail } = req.body;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, thumbnail },
            { new: true }
        );
        if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });

        // Remove blog from user's blog list
        await User.findByIdAndUpdate(deletedBlog.createdBy, { $pull: { blogs: deletedBlog._id } });

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get blogs created by the logged-in user
exports.getUserBlogs = async (req, res) => {
    try {
        const DEFAULT_PROFILE_IMAGE = `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`;
        const DEFAULT_THUMBNAIL_IMAGE = `${req.protocol}://${req.get('host')}/uploads/defaults/Set-Default-Featured-Image.jpg`;


        const blogs = await Blog.find({ createdBy: req.userId })
            .sort({ createdAt: -1 }) //Sort by most recent blog
            .populate('createdBy', 'name profileImage'); //Populate the creator's details

            const blogsWithFullImagePaths = blogs.map((blog) => ({
                ...blog.toObject(), // Converting Mongoose document to plain object
                createdBy: blog.createdBy
                    ? {
                          ...blog.createdBy.toObject(),
                          profileImage: blog.createdBy.profileImage
                              ? `${req.protocol}://${req.get('host')}${blog.createdBy.profileImage}`
                              : DEFAULT_PROFILE_IMAGE,
                      }
                    : { name: 'Unknown User', profileImage: DEFAULT_PROFILE_IMAGE }, 
                thumbnail: blog.thumbnail ? `${req.protocol}://${req.get('host')}${blog.thumbnail}`:DEFAULT_THUMBNAIL_IMAGE,
            }));
    
            res.status(200).json({ blogs: blogsWithFullImagePaths });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
};

// Get recent blogs
exports.getRecentBlogs = async (req, res) => {
    try {
        const DEFAULT_PROFILE_IMAGE = `${req.protocol}://${req.get('host')}/uploads/defaults/default-profile.jpg`;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(10) // Fetch only the 10 most recent blogs
            .populate('createdBy', 'name profileImage'); // Populate the creator's details

            const blogsWithFullImagePaths = blogs.map((blog) => ({
                ...blog.toObject(), // Convert Mongoose document to plain object
                createdBy: blog.createdBy
                    ? {
                          ...blog.createdBy.toObject(),
                          profileImage: blog.createdBy.profileImage
                              ? `${req.protocol}://${req.get('host')}${blog.createdBy.profileImage}`
                              : DEFAULT_PROFILE_IMAGE,
                      }
                    : { name: 'Unknown User', profileImage: DEFAULT_PROFILE_IMAGE }, 
            }));
    
            res.status(200).json({ blogs: blogsWithFullImagePaths });

    } catch (error) {
        console.error('Error fetching recent blogs:', error);
        res.status(500).json({ error: 'Failed to fetch recent blogs' });
    }
};

