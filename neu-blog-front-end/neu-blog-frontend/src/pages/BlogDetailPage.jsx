import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetailsPage = () => {
    const { id } = useParams(); //Get blog id from the route
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blog/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }
                const data = await response.json();
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
            }
        };

        fetchBlog();
    }, [id]);

    if (!blog) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded">
            <h1 className="text-2xl font-bold">{blog.title}</h1>
            <p className="text-gray-600 mt-2">By {blog.createdBy?.name}</p>
            {blog.thumbnail && (
                <img
                    src={blog.thumbnail}
                    alt="Blog Thumbnail"
                    className="w-full h-64 object-cover rounded mt-4"
                />
            )}
            <p className="mt-6">{blog.content}</p>
        </div>
    );
};

export default BlogDetailsPage;
