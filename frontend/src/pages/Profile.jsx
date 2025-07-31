import React, { useEffect, useState } from 'react'
import SlideBar from '../components/SlideBar'
import { Link, useParams } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';
import { useGetPost } from '../hooks/useGetPost';
import useUpdateUser from '../hooks/useUpdateUser.js';
import useDeletePost from '../hooks/useDeletePost.js';
import { RiDeleteBinLine } from 'react-icons/ri';
import ProfileMenu from '../components/ProfileMenu.jsx';
import { formatDate } from '../utils/dataFomat.js';
import Card from '../components/Card.jsx';

const Profile = () => {
    const { id } = useParams();
    const userIns = JSON.parse(localStorage.getItem('userIns'));
    const { users, isLoading, error } = useGetUser();
    const { posts, isLoading: isLoadingPosts, error: errorPosts } = useGetPost();
    const user = users.find((user) => user._id === id);
    const [idUserCurrent, setIdUserCurrent] = useState(null);
    const { updateUser } = useUpdateUser();
    const { deletePost } = useDeletePost();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [postMenuOpen, setPostMenuOpen] = useState({});

    const [formUser, setFormUser] = useState({
        username: '',
        email: '',
        profilePicture: '',
        bio: ''
    });

    const handleEdit = (userData) => {
        document.getElementById('my_modal_4').showModal();
        setIdUserCurrent(userData._id);
        setFormUser(userData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm(formUser);
        if (Object.keys(errors).length > 0) {
            return alert(errors.username || errors.email);
        }
        setIsUpdating(true);
        try {
            await updateUser(idUserCurrent, formUser);
            document.getElementById('my_modal_4').close();
        } catch (error) {
            alert(error);
        } finally {
            setIsUpdating(false);
        }
    }

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.username) errors.username = 'Username bắt buộc không bỏ trống';
        if (!formData.email) errors.email = 'Email bắt buộc không bỏ trống';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email không đúng định dạng';
        }
        return errors;
    };

    const handleDeletePost = async (postId) => {
        setIsDeletingPost(true);
        try {
            await deletePost(postId);
            alert('Bài viết đã được xóa thành công!');
            setPostMenuOpen(prevState => ({ ...prevState, [postId]: false }));
        } catch (error) {
            alert('Không thể xóa bài viết: ' + error);
        } finally {
            setIsDeletingPost(false);
        }
    };

    if (isLoading || isLoadingPosts) {
        return <div className="flex justify-center items-center min-h-screen bg-black">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
        </div>
    }

    if (error || errorPosts) {
        return <div className="flex justify-center items-center min-h-screen text-red-500 bg-black">{error || errorPosts}</div>
    }

    return (
        <div className="w-full min-h-screen bg-black">
            <div className="grid grid-cols-12 max-w-[1300px] mx-auto">
                {/* Left sidebar */}
                <div className="col-span-2 flex flex-col pt-4 px-0">
                    <SlideBar />
                </div>

                {/* Main content */}
                <div className="col-span-8 min-h-screen flex justify-center px-0">
                    <div className="w-full max-w-2xl border-x border-neutral-800 min-h-screen bg-black flex flex-col">
                        {!user ? (
                            <div className="flex justify-center items-center min-h-screen text-white">User not found</div>
                        ) : (
                            <>
                                {/* Profile Header */}
                                <div className="flex flex-col gap-4 px-8 pt-8 pb-6 border-b border-neutral-800">
                                    <div className="flex items-center gap-6">
                                        <img
                                            src={user.profilePicture || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-4 border-neutral-900 shadow-md object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h1 className="text-2xl font-bold text-white truncate">{user?.username || "Unknown"}</h1>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-base text-neutral-500 font-medium truncate">@{user?.username}</span>
                                            </div>
                                            <p className="text-neutral-300 mt-3 text-base">{user.bio || "No bio"}</p>
                                            <div className="flex gap-8 text-neutral-400 mt-4 text-sm">
                                                <span>{posts.filter(post => post.userId === id).length} Posts</span>
                                            </div>
                                        </div>
                                        {userIns?.id === user?._id && (
                                            <button
                                                className="ml-4 text-base px-6 py-2 rounded-full bg-black border border-neutral-700 text-white font-semibold hover:bg-neutral-900 hover:border-blue-500 transition"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Sửa thông tin
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center border-b border-neutral-800 px-8 bg-black/80 sticky top-0 z-10">
                                    <button className="py-4 text-base font-semibold text-white border-b-4 border-blue-500 px-2 focus:outline-none">
                                        Bài đăng
                                    </button>
                                </div>

                                {/* Post List */}
                                <div className="flex flex-col w-full">
                                    {posts.filter(post => post.userId === id).length === 0 ? (
                                        <div className="flex justify-center items-center h-[300px] text-neutral-500">
                                            Chưa có bài post nào
                                        </div>
                                    ) : (
                                        posts
                                            .filter(post => post.userId === id)
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((post) => (
                                                <div
                                                    key={post._id}
                                                    className="flex w-full gap-4 border-b border-neutral-800 px-6 py-5 relative hover:bg-neutral-900/90 transition group"
                                                >
                                                    <Card
                                                        post={post}
                                                        onDelete={() => handleDeletePost(post._id)}
                                                        isDeleting={isDeletingPost}
                                                        // Truyền đúng props để nút xóa luôn hiện
                                                        isCurrentUserPost={userIns?.id === user?._id}
                                                    />
                                                </div>
                                            ))
                                    )}
                                </div>

                            </>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-span-2 flex flex-col pt-4 px-0 ">
                    <ProfileMenu />
                </div>
            </div>

            {/* Modal edit */}
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-2xl bg-neutral-900 text-white rounded-2xl">
                    <h3 className="font-bold text-lg">Chỉnh sửa thông tin</h3>
                    <div className="py-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-white">Username</span>
                                </label>
                                <input
                                    type="text"
                                    value={formUser.username}
                                    onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
                                    className="input input-bordered w-full bg-neutral-800 border-neutral-700 text-white"
                                />
                            </div>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-white">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={formUser.email}
                                    onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                                    className="input input-bordered w-full bg-neutral-800 border-neutral-700 text-white"
                                />
                            </div>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-white">Profile Picture URL</span>
                                </label>
                                <input
                                    type="text"
                                    value={formUser.profilePicture}
                                    onChange={(e) => setFormUser({ ...formUser, profilePicture: e.target.value })}
                                    className="input input-bordered w-full bg-neutral-800 border-neutral-700 text-white"
                                />
                            </div>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text text-white">Bio</span>
                                </label>
                                <textarea
                                    value={formUser.bio}
                                    onChange={(e) => setFormUser({ ...formUser, bio: e.target.value })}
                                    className="textarea textarea-bordered h-24 bg-neutral-800 border-neutral-700 text-white"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className="btn btn-primary" type="submit" disabled={isUpdating}>
                                    {isUpdating ? <span className="loading loading-spinner"></span> : "Sửa"}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    type="button"
                                    onClick={() => document.getElementById('my_modal_4').close()}
                                >
                                    Thoát
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-action">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('my_modal_4').close()}>✕</button>
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default Profile
