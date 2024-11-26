import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.status === 201) {
                navigate('/login'); 
            } else if (response.status === 400) {
                setErrorMessage(data.error);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000); // Auto-hide after 3 seconds
            } else {
                setErrorMessage('Something went wrong');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('An error occurred. Please try again.');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <form onSubmit={handleRegister}>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-1 border border-blue-300 rounded mt-2 mb-4"
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-1 border border-blue-300 rounded mt-1 mb-4"
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-1 border border-blue-300 rounded mt-1 mb-4"
                />

                
                <label>Profile Image</label>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInput"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="fileInput"
                        className="block w-full text-center border border-purple-500 bg-white-500 text-black p-2 rounded-full cursor-pointer"
                    >
                        Choose File
                    </label>
                </div>
                {profileImage && <p className="text-sm text-gray-600 mt-2">{profileImage.name}</p>}


                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded mt-4">Register</button>
            </form>

            {/* Popup Notification */}
            {showNotification && (
                <div className="absolute top-20 right-4 bg-red-600 text-white px-4 py-4 rounded shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
