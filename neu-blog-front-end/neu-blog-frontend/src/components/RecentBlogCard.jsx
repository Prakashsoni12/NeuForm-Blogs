import { Link } from 'react-router-dom';

const RecentBlogsCard = ({ id, profileImage, username, title }) => (
    <Link to={`/blog/${id}`} className="block">
        <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 transition">
            <img
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
            />
            <div>
                <h3 className="text-lg font-semibold">{username || 'Unknown User'}</h3>
                <p className="text-sm text-gray-600">{title || 'Untitled Blog'}</p>
            </div>
        </div>
    </Link>
);

export default RecentBlogsCard;
