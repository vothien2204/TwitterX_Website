import { Link } from 'react-router-dom'

const Friend = ({ user }) => {
    return (
        <div className="flex items-center justify-between w-full py-3 border-b border-neutral-800 last:border-b-0 px-0 hover:bg-neutral-900 transition">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={user.profilePicture || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-neutral-700 object-cover"
                    onError={(e) => {
                        e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg";
                    }}
                />
                <div className="min-w-0">
                    <div className="flex items-center gap-1">
                        <h3 className="font-bold text-white truncate">{user.username}</h3>
                        {/* Nếu bạn muốn tích xanh thì bổ sung logic ở đây */}
                    </div>
                    <p className="text-sm text-neutral-500 truncate">@{user.username}</p>
                </div>
            </div>
            <Link
                to={`/profile/${user._id}`}
                className="px-5 py-1 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition whitespace-nowrap ml-2"
            >
                Xem
            </Link>
        </div>
    )
}

export default Friend
