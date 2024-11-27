import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDetailsPage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async (blogId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/user/details/${blogId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("get current user detail->",data)
                    setUser(data.user);
                    setName(data.user.name);
                    setEmail(data.user.email);
                } else {
                    console.error('Failed to fetch user details.');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (profileImage) formData.append('profileImage', profileImage);

            const response = await fetch('http://localhost:5000/api/user/update', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('User updated successfully:', updatedUser);
                localStorage.setItem('username', updatedUser.name);
                localStorage.setItem('profileImage', updatedUser.profileImage);
                navigate('/');
            } else {
                console.error('Failed to update user.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/user/delete', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('User deleted successfully.');
                localStorage.clear();
                navigate('/register');
            } else {
                console.error('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded">
            <h1 className="text-2xl font-bold mb-6">User Details</h1>
            {user ? (
                <form onSubmit={handleUpdate}>
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />

                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />

                    <label className="block mb-2">Profile Image</label>
                    <input
                        type="file"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="w-full p-2 mb-4 border rounded"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Profile
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                    >
                        Delete Profile
                    </button>
                </form>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
};

export default UserDetailsPage;
