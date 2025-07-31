import React from 'react'
import { useGetUser } from '../hooks/useGetUser'
import { formatDate } from '../utils/dataFomat'
import useUpdatePost from '../hooks/useUpdatePost';
import Comment from './Comment';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';

const Card = ({ post, onDelete, isDeleting, isCurrentUserPost }) => {
    const { users, isLoading } = useGetUser();
    const userIns = JSON.parse(localStorage.getItem('userIns'));
    const [isLiked, setIsLiked] = React.useState(userIns ? post.likes.includes(userIns.id) : false);
    const { updatePost } = useUpdatePost();

    const user = users.find(user => user._id === post.userId);

    const handleLike = async () => {
        if (!userIns) {
            alert("Vui lòng đăng nhập để thực hiện chức năng này!");
            return;
        }

        try {
            let updatedLikes;
            if (isLiked) {
                updatedLikes = post.likes.filter(id => id !== userIns.id);
            } else {
                if (!post.likes.includes(userIns.id)) {
                    updatedLikes = [...new Set([...post.likes, userIns.id])];
                } else {
                    updatedLikes = [...post.likes];
                }
            }

            await updatePost(post._id, { likes: updatedLikes });
            setIsLiked(!isLiked);
            // window.location.reload();
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    if (!post || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return (
        <div className="flex w-full gap-4 border-b border-neutral-800 px-6 py-5 relative hover:bg-neutral-900 transition group">
            {/* Avatar */}
            <Link to={`/profile/${post.userId}`} className="flex-shrink-0">
                <img
                    src={user?.profilePicture || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border border-neutral-800 object-cover"
                    onError={(e) => {
                        e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg";
                    }}
                />
            </Link>
            {/* Main post content */}
            <div className="flex-1 min-w-0">
                {/* Top row: username, @, time, menu */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-white text-base truncate">{user?.username || "Unknown"}</span>
                        <span className="text-sm text-neutral-500 truncate">@{user?.username || "unknown"}</span>
                        <span className="text-sm text-neutral-500 ml-2">{formatDate(post.createdAt)}</span>
                    </div>
                    {isCurrentUserPost && (
                        <button
                            onClick={onDelete}
                            className="text-neutral-400 hover:bg-neutral-800 rounded-full p-2 transition"
                            disabled={isDeleting}
                            title="Xóa bài viết"
                        >
                            {isDeleting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <RiDeleteBinLine className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
                {/* Caption */}
                <div className="mt-1 mb-2">
                    <p className="text-white text-base break-words">{post.caption}</p>
                </div>
                {/* Image (if any) */}
                {post.image && (
                    <div className="mt-2 mb-1 rounded-2xl overflow-hidden border border-neutral-800 max-w-xl">
                        <img
                            src={post.image}
                            alt={post.caption}
                            className="w-full max-h-180 object-cover"
                            onError={(e) => {
                                e.target.src = "https://c.ndtvimg.com/2025-04/7mqh5apg_a_625x300_03_April_25.jpg?im=FitAndFill,algorithm=dnn,width=1200,height=738";
                            }}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                    {/* Like */}
                    <button
                        className={`flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-100/10 transition ${isLiked ? 'text-red-500' : 'text-neutral-400'} text-base`}
                        onClick={handleLike}
                        disabled={!userIns}
                        title="Like"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 ${isLiked ? "fill-red-500" : "fill-none"}`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span>{post.likes.length}</span>
                    </button>
                    {/* Comment */}
                    <button
                        className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-100/10 transition text-neutral-400 text-base"
                        onClick={() => document.getElementById(`comment_modal_${post._id}`).showModal()}
                        title="Bình luận"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Bình luận</span>
                    </button>
                </div>

                {/* Comment Modal */}
                <dialog id={`comment_modal_${post._id}`} className="modal">
                    <div className="modal-box bg-black text-white">
                        {/* Header: h3 và nút đóng cùng hàng */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Bình Luận</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-ghost text-white">Đóng</button>
                            </form>
                        </div>
                        {/* Nội dung comment */}
                        <Comment postId={post._id} />
                    </div>
                </dialog>

            </div>
        </div>
    )
}

export default Card
