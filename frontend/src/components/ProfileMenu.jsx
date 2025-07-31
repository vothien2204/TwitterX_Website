import { Link } from 'react-router-dom'
import { useGetUser } from '../hooks/useGetUser'


const ProfileMenu = () => {
    const userIns = JSON.parse(localStorage.getItem('userIns'));
    const { users, isLoading, error } = useGetUser();

    if (!users || isLoading) {
        return (
            <div className="bg-black border border-neutral-800 rounded-2xl w-80 py-8 flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        );
    }

    return (
        <div className="bg-black border border-neutral-800 rounded-2xl w-80 px-0 py-4 shadow-xl">
            {/* Tiêu đề */}
            <div className="px-5 pb-2">
                <p className="text-lg font-bold text-white">Gợi ý cho bạn</p>
            </div>
            {/* Danh sách user */}
            <div className="space-y-1">
                {users.filter(user => !userIns || user._id !== userIns.id).slice(0, 3).map((user, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between px-5 py-2 rounded-xl hover:bg-neutral-900 transition"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src={user.profilePicture || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"}
                                alt="profile"
                                className="w-11 h-11 rounded-full border border-neutral-700 object-cover"
                                onError={(e) => {
                                    e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg";
                                }}
                            />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-base font-bold text-white truncate">{user.username}</span>
                                    {/* Nếu có tích xanh */}
                                    {user.isVerified && (
                                        <svg viewBox="0 0 24 24" aria-label="Verified" className="w-4 h-4 text-blue-500" fill="currentColor">
                                            <g><path d="M22.5 12l-2.232 1.298.427 2.561-2.054.348-.348 2.054-2.561-.427L12 22.5l-1.298-2.232-2.561.427-.348-2.054-2.054-.348.427-2.561L1.5 12l2.232-1.298-.427-2.561 2.054-.348.348-2.054 2.561.427L12 1.5l1.298 2.232 2.561-.427.348 2.054 2.054.348-.427 2.561L22.5 12z"></path></g>
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-neutral-500 truncate block">@{user.username}</span>
                            </div>
                        </div>
                        <Link to={`/profile/${user._id}`}
                            className="px-5 py-1 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-neutral-200 focus:outline-none"
                        >
                            Xem thêm
                        </Link>
                    </div>
                ))}
            </div>
            <div className="px-5 pt-2 pb-1">
                <Link
                    to="/search"
                    className="text-sm text-blue-400 font-semibold hover:underline transition"
                >
                    Xem thêm
                </Link>
            </div>
        </div>
    )
}

export default ProfileMenu
