import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateBlogPage from './pages/CreateBlogPage';
import BlogDetailsPage from './pages/BlogDetailPage';
import MyBlogsPage from './pages/MyBlogPage';
import EditBlogPage from './pages/EditBlogPage';
function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    useEffect(() => {
        const username = localStorage.getItem('username');
        console.log(username,"user-name found")

        const profileImage = localStorage.getItem('profileImage') || '/default-profile.png';
        
        if (username) {
            setLoggedInUser({ username, profileImage });
        }else if(username === undefined){
            setLoggedInUser(null);
        } else {
            setLoggedInUser(null);
        }
    }, []);

    const handleLogin = (user) => {
        // Save user info in localStorage and update state
        setLoggedInUser(user);
    };

    const handleLogout = () => {
        // Clear user info from localStorage and update state
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('token');
        setLoggedInUser(null);

    };
    return (
        <Router>
            {/* Navbar always visible */}
            <Navbar
                username={loggedInUser?.username}
                profileImage={loggedInUser?.profileImage}
                onLogout={handleLogout}
            />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/login"
                    element={<LoginPage onLogin={handleLogin} />}
                />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/create-blog"
                    element={
                        loggedInUser ? (
                            <CreateBlogPage />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/blog/:id" element={<BlogDetailsPage />} />
                <Route path="/my-blogs" element={<MyBlogsPage />} />
                <Route path="/edit-blog/:id" element={<EditBlogPage />} />

            </Routes>
        </Router>
    );
}

export default App;
