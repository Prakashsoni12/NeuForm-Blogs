import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const MyBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserBlogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. Redirecting to login.');
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/blog/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data.blogs || []);
                } else {
                    console.error('Failed to fetch user blogs.');
                }
            } catch (error) {
                console.error('Error fetching user blogs:', error);
            }
        };

        fetchUserBlogs();
    }, []);

    const handleUpdate = (blogId) => {
        navigate(`/edit-blog/${blogId}`);
    };

    const handleDelete = async (blogId) => {
        console.log('Deleting blog with ID:', blogId); // Debug log
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
                setErrorMessage("Deleted successfully!");
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                console.log('Blog deleted successfully.');
            } else {
                console.error('Failed to delete blog. Status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };
    

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6">My Blogs</h1>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog._id} className="relative border rounded-lg p-4 mb-4 shadow-lg">
                        <h2 className="text-xl font-semibold">{blog.title}</h2>
                        <p className="text-gray-600">{blog.content.substring(0, 200)}...</p>
                        {blog.thumbnail && (
                            <img
                                src={blog.thumbnail}
                                alt="Blog Thumbnail"
                                className="w-full h-48 object-cover rounded-lg mt-4"
                            />
                        )}
                        {/* Update and Delete Buttons */}
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => handleUpdate(blog._id)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(blog._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">You haven&apos;t created any blogs yet.</p>
            )}

           {showNotification && (
                <div className="absolute top-20 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default MyBlogsPage;
