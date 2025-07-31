import React from 'react'
import { useGetComment } from '../hooks/useGetComment';
import { formatDate } from '../utils/dataFomat';
import { useGetUser } from '../hooks/useGetUser';
import { useAddComment } from '../hooks/useAdd_DeleteComment';

const Comment = ({ postId }) => {
  const { comments, isLoading, error } = useGetComment(postId);
  const { users } = useGetUser();
  const { addComment } = useAddComment();
  const userIns = JSON.parse(localStorage.getItem('userIns'));

  const [commentText, setCommentText] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userIns) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }
    if (!commentText.trim()) return;
    try {
      await addComment(postId, commentText);
      setCommentText("");
      // window.location.reload();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-48 bg-black text-white">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-48 bg-black text-red-500">Error: {error}</div>;

  return (
    <div className="py-3 px-0 bg-black rounded-2xl">
      {/* List comments */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto mb-2 pr-2">
        {comments.map((comment) => {
          const user = users?.find(u => u._id === comment.userId);
          return (
            <div key={comment._id} className="flex items-start gap-3">
              <img
                src={user?.profilePicture || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"}
                alt="user"
                className="w-8 h-8 rounded-full border border-neutral-800 object-cover mt-1"
                onError={(e) => {
                  e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg";
                }}
              />
              <div className="flex-1">
                <div className="bg-neutral-900 rounded-2xl px-4 py-2 w-fit min-w-[100px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm">{user?.username || "user"}</span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs text-neutral-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-neutral-100 break-words">{comment.text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Form add comment */}
      <form className="flex items-center gap-2 mt-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={userIns ? "Nhập bình luận..." : "Vui lòng đăng nhập để bình luận"}
          className="w-full py-2 px-4 rounded-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!userIns}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-full font-semibold bg-blue-500 text-white hover:bg-blue-600 transition disabled:bg-neutral-700 disabled:text-neutral-400`}
          disabled={!userIns || !commentText.trim()}
        >
          Gửi
        </button>
      </form>
    </div>
  )
}

export default Comment
