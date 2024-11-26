const BlogCard = ({ profileImage, username, title, imageUrl, content }) => (
    
    <div className="text-center border border-gray-200 mb-5 rounded-lg p-4 shadow-lg">
        <img
            src={profileImage || '/default-profile.png'} 
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto"
        />

        <h2 className="text-lg font-semibold mt-2">
            {username || 'Unknown User'} 
        </h2>

        <div className="relative mt-4">
            <img
                src={imageUrl || '/default-thumbnail.png'} 
                alt="Blog"
                className="w-full h-64 object-cover rounded-lg"
            />
            <h3 className="absolute bottom-2 left-2 text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded">
                {title || 'Untitled Blog'} 
            </h3>
        </div>

     
        <p className="mt-4 text-gray-700">
            {content || 'No content available.'} 
        </p>
    </div>
);

export default BlogCard;
