import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlogPage = () => {
    const { id } = useParams(); //get the blog ID from the route
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        //fetch the blog details to prefill the form
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blog/${id}`);
                if (response.ok) {
                    const blog = await response.json();
                    setTitle(blog.title);
                    setContent(blog.content);
                    setThumbnail(blog.thumbnail);
                } else {
                    console.error('Failed to fetch blog details');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (thumbnail) formData.append('thumbnail', thumbnail);

            const response = await fetch(`http://localhost:5000/api/blog/update/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Blog updated successfully');
                navigate('/my-blogs');
            } else {
                console.error('Failed to update blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
            <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
            <form onSubmit={handleUpdate}>
                <label className="block mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />

                <label className="block mb-2">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 mb-4 border rounded h-32"
                ></textarea>

                <label className="block mb-2">Thumbnail</label>
                <input
                    type="file"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="w-full p-2 mb-4 border rounded"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Update Blog
                </button>
            </form>
        </div>
    );
};

export default EditBlogPage;
