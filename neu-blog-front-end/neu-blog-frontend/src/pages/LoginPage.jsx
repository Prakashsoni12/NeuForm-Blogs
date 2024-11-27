import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("from login page login response",  data.user.name)
           
            if (response.status === 200) {
               //Save user data to localStorage
              
               localStorage.setItem('username', data.user.name);
               localStorage.setItem('profileImage', data.user.profileImage);
               localStorage.setItem('token', data.token);

               // Update parent state
               onLogin({ username: data.user.name, profileImage: data.user.profileImage });
               navigate('/create-blog');
            } else if (response.status === 404) {
                // Show popup notification for non-existent user
                setErrorMessage(data.error,"Invalid credentials");
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000); // Auto-hide after 3 seconds
            } else if (response.status === 401) {
                setErrorMessage("Check credentials",data.error);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            } else {
                setErrorMessage('Something went wrong');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again.');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    return (
            <div className="max-w-md mx-auto mt-20 p-5 bg-grey shadow-lg rounded-lg ">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-2 mb-4"
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-2 mb-4"
                />
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded mt-4">Login</button>
            </form>
            {/* Popup Notification */}
            {showNotification && (
                <div className="absolute top-20 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
        
    );
};

export default LoginPage;
