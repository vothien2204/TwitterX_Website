import React, { useState } from 'react'
import SlideBar from '../components/SlideBar'
import { FaSearch } from 'react-icons/fa'
import Friend from '../components/Friend'
import { useGetUser } from '../hooks/useGetUser'
import ProfileMenu from '../components/ProfileMenu'

const Searching = () => {
  const { users, isLoading, error } = useGetUser();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="grid grid-cols-12 max-w-[1300px] mx-auto">
        {/* Sidebar trái */}
        <div className="col-span-2 flex flex-col pt-4 px-0 ">
          <SlideBar />
        </div>
        {/* Main content */}
        <div className="col-span-8 min-h-screen flex justify-center px-0">
          <div className="w-full max-w-2xl border-x border-neutral-800 min-h-screen bg-black flex flex-col">
            <div className="relative mx-5 mt-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-3 pl-5 pr-10 bg-neutral-900 border border-neutral-700 rounded-full text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
            </div>

            {/* Friend/User list */}
            <div className="w-full max-w-2xl flex flex-col divide-y divide-neutral-800">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-neutral-500 text-lg">Không tìm thấy người dùng nào.</div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center px-6 py-4 hover:bg-neutral-900 transition"
                  >
                    {/* Bạn có thể tùy biến lại component Friend cho đẹp giống X, còn không thì dùng như cũ */}
                    <Friend user={user} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-2 flex flex-col pt-4 px-0 ">
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}

export default Searching
