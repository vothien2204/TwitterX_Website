import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { IoCreateOutline, IoLogIn, IoLogOut, IoPerson } from 'react-icons/io5'
import { useLogout } from '../hooks/useLogout'
import { useGetUser } from '../hooks/useGetUser'

const SlideBar = () => {
    const userIns = JSON.parse(localStorage.getItem('userIns'));
    const { logout, isLoading } = useLogout();
    const { users } = useGetUser();
    const location = useLocation();

    const user = users.find(user => user._id === userIns?.id);

    return (
        <aside className="h-screen w-full max-w-xs bg-black py-8 px-4 flex flex-col justify-between sticky top-0 left-0 z-30">
            <div>
                {/* Logo X */}
                <div className="flex items-center justify-start mb-8 pl-2">
                    <svg width="36" height="36" viewBox="0 0 120 120" fill="none">
                        <rect width="120" height="120" rx="24" fill="#18181B" />
                        <path d="M73 40H83L62 67L87 100H69L55.5 81.5L39 100H29L51.5 71L27 40H46L59 57L73 40ZM70.5 94H75L46.5 45.5H41.5L70.5 94Z" fill="white" />
                    </svg>
                </div>
                {/* Menu */}
                <nav className="flex flex-col gap-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition ${location.pathname === "/" ? "bg-neutral-800 text-blue-400" : "text-white hover:bg-neutral-800 hover:text-blue-400"
                            }`}
                    >
                        <AiFillHome className="text-2xl" />
                        <span>Trang Chủ</span>
                    </Link>
                    <Link
                        to="/search"
                        className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition ${location.pathname === "/search" ? "bg-neutral-800 text-blue-400" : "text-white hover:bg-neutral-800 hover:text-blue-400"
                            }`}
                    >
                        <BiSearch className="text-2xl" />
                        <span>Tìm kiếm</span>
                    </Link>
                    <Link
                        to="/create-post"
                        className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition ${location.pathname === "/create-post" ? "bg-neutral-800 text-blue-400" : "text-white hover:bg-neutral-800 hover:text-blue-400"
                            }`}
                    >
                        <IoCreateOutline className="text-2xl" />
                        <span>Tạo bài viết</span>
                    </Link>
                    {userIns && user && (
                        <Link
                            to={`/profile/${user._id}`}
                            className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition ${location.pathname.startsWith("/profile") ? "bg-neutral-800 text-blue-400" : "text-white hover:bg-neutral-800 hover:text-blue-400"
                                }`}
                        >
                            <IoPerson className="text-2xl" />
                            <span>Cá nhân</span>
                        </Link>
                    )}
                </nav>
            </div>

            {/* User info - LUÔN HIỂN THỊ DƯỚI CÙNG VÀ NẰM TRÊN MÀN HÌNH */}
            <div className="w-full">
                {userIns && user ? (
                    <div
                        className="flex items-center justify-between px-3 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 mb-2 shadow-sm"
                        style={{ minHeight: 48 }}
                    >
                        {/* Avatar + username */}
                        <Link
                            to={`/profile/${user._id}`}
                            className="flex items-center gap-3 min-w-0 group"
                        >
                            <img
                                src={
                                    user.profilePicture === ""
                                        ? "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"
                                        : user.profilePicture
                                }
                                alt="profile"
                                className="w-9 h-9 rounded-full border border-neutral-600 object-cover"
                            />
                            <span className="text-white text-base font-semibold truncate group-hover:text-blue-400 transition">
                                {user.username}
                            </span>
                        </Link>
                        {/* Logout icon */}
                        <button
                            onClick={logout}
                            disabled={isLoading}
                            title="Đăng xuất"
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-neutral-800 transition disabled:opacity-60 ml-2"
                            style={{ minWidth: 32, minHeight: 32 }}
                        >
                            {isLoading
                                ? <span className="loading loading-spinner loading-xs text-neutral-400"></span>
                                : <IoLogOut className="text-xl text-blue-500" />}
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-full text-white text-base font-medium bg-blue-500/90 hover:bg-blue-600 transition mb-2"
                    >
                        <IoLogIn className="text-xl" />
                        <span>Đăng nhập</span>
                    </Link>
                )}
            </div>

        </aside>
    )
}

export default SlideBar
