import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlogPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const navigate = useNavigate();

    //fetch user blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/blog/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, //pass the token in headers
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data.blogs || []);
                } else {
                    console.error('Failed to fetch blogs');
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, [navigate]);

    //handle Thumbnail Upload
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
        }
    };

    //handle Blog Create
    const handleBlogCreate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const response = await fetch('http://localhost:5000/api/blog/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newBlog = await response.json();
                setBlogs((prevBlogs) => [newBlog.blog, ...prevBlogs]); //update blogs list
                navigate('/'); //redirect after creating the blog
            } else {
                console.error('Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    // Handle Blog Update
    const handleBlogUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token || !selectedBlogId) return;

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const response = await fetch(`http://localhost:5000/api/blog/update/${selectedBlogId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedBlog = await response.json();
                setBlogs((prevBlogs) =>
                    prevBlogs.map((blog) =>
                        blog._id === updatedBlog.blog._id ? updatedBlog.blog : blog
                    )
                );
                setSelectedBlogId(null); //clear selected blog ID
                navigate('/');
            } else {
                console.error('Failed to update blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    //handle Blog Delete
    const handleBlogDelete = async (blogId) => {
        const token = localStorage.getItem('token');
        if (!token || !blogId) return;

        try {
            const response = await fetch(`http://localhost:5000/api/blog/delete/${blogId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
            } else {
                console.error('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    return (
        <div className="flex p-8 space-x-8 mt-20">
            {/* Blog Form */}
            <div className="w-2/3 mt-20">
                <h2 className="text-2xl font-semibold mb-4">
                    {selectedBlogId ? 'Update Blog' : 'Create a New Blog'}
                </h2>
                <form onSubmit={selectedBlogId ? handleBlogUpdate : handleBlogCreate}>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />

                    <label className="block mb-2">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 mb-4 border rounded h-32"
                        required
                    ></textarea>

                    <label className="block mb-2">Thumbnail</label>
                    <input
                        type="file"
                        onChange={handleThumbnailChange}
                        className="w-full p-2 mb-4 border rounded"
                    />

                    {thumbnail && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Uploaded Thumbnail Preview:</p>
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt="Thumbnail"
                                className="w-32 h-32 rounded"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded mt-4"
                    >
                        {selectedBlogId ? 'Update Blog' : 'Post Blog'}
                    </button>
                </form>
            </div>

            {/* -- Update & Delete Section --- */}
            <div className="w-1/3 border-l-4 border-blue-600 pl-4">
                <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="mb-4 p-2 border rounded">
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-sm">{blog.content.substring(0, 250)}</p>
                            {blog.thumbnail && (
                                <img
                                    src={blog.thumbnail}
                                    alt="Thumbnail"
                                    className="w-16 h-16 mt-2 rounded"
                                />
                            )}
                            <button
                                onClick={() => {
                                    setTitle(blog.title);
                                    setContent(blog.content);
                                    setThumbnail(null);
                                    setSelectedBlogId(blog._id);
                                }}
                                className="bg-yellow-500 text-white p-2 rounded w-full mt-2"
                            >
                                Update Blog
                            </button>
                            <button
                                onClick={() => handleBlogDelete(blog._id)}
                                className="bg-red-500 text-white p-2 rounded w-full mt-2"
                            >
                                Delete Blog
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No blogs available.</p>
                )}
            </div>
        </div>
    );
};

export default CreateBlogPage;
