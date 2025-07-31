import React, { useState } from 'react'
import ProfileMenu from '../components/ProfileMenu'
import SlideBar from '../components/SlideBar'
import { useGetPost } from '../hooks/useGetPost';
import Card from '../components/Card'; // Make sure you are importing the updated Card component
import { useParams } from 'react-router-dom';
import useUpdatePost from '../hooks/useUpdatePost';
import useDeletePost from '../hooks/useDeletePost';

const ProfilePost = () => {
    const { id } = useParams();
    const { posts, isLoading, error } = useGetPost();
    const userIns = JSON.parse(localStorage.getItem('userIns'));
    const { updatePost } = useUpdatePost();
    const { deletePost } = useDeletePost();
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null); // To track which post is being deleted

    const handleLike = async (post) => {
        try {
            let updatedLikes;
            if (post.likes.includes(userIns.id)) {
                updatedLikes = post.likes.filter(id => id !== userIns.id);
            } else {
                if (!post.likes.includes(userIns.id)) {
                    updatedLikes = [...new Set([...post.likes, userIns.id])];
                } else {
                    updatedLikes = [...post.likes];
                }
            }

            await updatePost(post._id, { likes: updatedLikes });
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        setIsDeletingPost(true);
        setDeletingPostId(postId); // Set the ID of the post being deleted
        try {
            await deletePost(postId);
            // After successful deletion, you might want to refresh the posts or update the state to remove the deleted post.
            // For simplicity, we'll just reload the page for now, or you can refetch posts using useGetPost again.
            window.location.reload(); // Simple page reload to refresh posts - or refetch posts
            alert('Bài viết đã được xóa thành công!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Không thể xóa bài viết: ' + error);
        } finally {
            setIsDeletingPost(false);
            setDeletingPostId(null); // Reset deleting post ID
        }
    };


    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    {/* Left sidebar */}
                    <div className="col-span-2 flex flex-col pt-4 px-0 border-r border-neutral-800">
                        <SlideBar />
                    </div>

                    {/* Main content */}
                    <div className="col-span-8 flex justify-center bg-black px-0 min-h-screen">
                        <div className="w-full max-w-2xl  min-h-screen flex flex-col">
                            {/* Feed header */}
                            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Bài viết</h2>
                            </div>
                            {/* Post list */}
                            {posts
                                .filter(post => post.userId === id)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((post) => (
                                    <div key={post._id} className="flex justify-center items-center w-full border-b border-neutral-800 last:border-b-0">
                                        <Card
                                            post={post}
                                            onLike={() => handleLike(post)}
                                            onDelete={() => handleDeletePost(post._id)}
                                            isDeleting={isDeletingPost && deletingPostId === post._id}
                                            isCurrentUserPost={userIns?.id === post.userId}
                                        />
                                    </div>
                                ))}
                            {/* Nếu không có bài viết */}
                            {posts.filter(post => post.userId === id).length === 0 && (
                                <div className="flex justify-center items-center w-full py-10">
                                    <span className="text-neutral-500 text-lg">Chưa có bài viết nào.</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right sidebar */}
                    <div className="col-span-2 flex flex-col pt-4 px-0 border-l border-neutral-800">
                        <ProfileMenu />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePost