import { Link,useNavigate } from 'react-router-dom';

const Navbar = ({ username, profileImage, onLogout  }) => {
    const isLoggedIn = username && profileImage;
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Clear user state and localStorage in App
        navigate('/login'); 
    };

    return (
        <nav className="bg-blue-600 p-4 flex justify-between fixed items-center top-0 left-0 w-full z-10 shadow-lg">
            {/* Left side: Navigation Links */}
            <div className="flex space-x-4 text-white">
                <Link to="/" className="hover:underline">Blog</Link>
                {isLoggedIn && (
                    <Link to="/create-blog" className="hover:underline">Write Blog</Link>
                )}
                 {isLoggedIn && (
                    <Link to="/my-blogs" className="text-white hover:underline">My Blogs</Link>
                )}
            </div>

            {/* Right side: User Profile or Auth Buttons */}
            {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                    <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
                    <span className="text-white">{username}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
                
            ) : (
                <div className="flex space-x-4">
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100">
                        Login
                    </Link>
                    <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100">
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
