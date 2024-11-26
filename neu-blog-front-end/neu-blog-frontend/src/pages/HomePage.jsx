import { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import RecentBlogsCard from '../components/Recentblogcard';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [userBlogs, setUserBlogs] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
      // Fetch user's blogs
      useEffect(() => {
        const fetchUserBlogs = async () => {
            if (!token) {
                console.error('No token found. Redirecting to login.');
                navigate('/login');

                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/blog/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            
                if (response.status === 401) {
                    console.error('Unauthorized. Redirecting to login.');
                    navigate('/login');

                    return;
                }
                const data = await response.json();
                console.log("this is user blog data",data)
               
                setUserBlogs(data.blogs || []);
                
                
            } catch (error) {
                console.error('Error fetching user blogs:', error);
            }
        };
        if (token) fetchUserBlogs();
    }, [token]);

      // Fetch recent blogs
      useEffect(() => {
        const fetchRecentBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/blog/recent');
                const data = await response.json();
                console.log("data coming from recentblogs",data)
                setRecentBlogs(data.blogs || []);
            } catch (error) {
                console.error('Error fetching recent blogs:', error);
            }
        };

        fetchRecentBlogs();
    }, []);

     //fetch all blogs for everyone
     useEffect(() => {
        const fetchAllBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/blog/all');
                const data = await response.json();
                console.log('All Blogs:', data);
                const blogs = data.blogs || data.data?.blogs || data; 

                setAllBlogs(blogs || []);
            } catch (error) {
                console.error('Error fetching all blogs:', error);
            }
        };

        fetchAllBlogs();
    }, []);


    return (
        <>
            <div className="flex p-8">
                {/* Left Section (70%) */}
                <div className="w-[70%] mt-20 pr-8">
                <h2 className="text-xl font-semibold mb-4">
                        All Blogs
                    </h2>
                    {allBlogs.length > 0 ? (
                        allBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                id={blog._id}
                                profileImage={blog?.createdBy?.profileImage || '/default-profile.png'}
                                username={blog?.createdBy?.name || 'Unknown User'}
                                title={blog.title}
                                imageUrl={blog.thumbnail}
                                content={blog.content.substring(0, 1000)} 
                            />
                        ))
                    ) : (
                        <p className="text-gray-600">No blogs available.</p>
                    )}
                </div>

                {/* ----Vertical Separator line--- */}
                <div className="w-1 mt-20 bg-blue-600"></div>

                {/* Right Section (30%) */}
                <div className="w-[30%] mt-20 pl-8">
                <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>
                {recentBlogs.length > 0 ? (
                    recentBlogs.map((blog) => (
                       
                        <RecentBlogsCard
                        key={blog._id}
                        id={blog._id} // Pass the blog ID for navigation
                        profileImage={blog?.createdBy?.profileImage || '/default-profile.png'}
                        username={blog?.createdBy?.name || 'Unknown User'}
                        title={blog.title}
                    />
                    ))
                ) : (
                    <p className="text-gray-600">No recent blogs available.</p>
                )}
                
            </div>
            </div>
        </>
    );
};

export default HomePage;
