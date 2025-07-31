import ProfileMenu from '../components/ProfileMenu'
import Card from '../components/Card.jsx'
import SlideBar from '../components/SlideBar'
import { useGetPost } from '../hooks/useGetPost'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Home = () => {
  const { posts, isLoading, error } = useGetPost();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 bg-black">{error}</div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="grid grid-cols-12 max-w-[1300px] mx-auto">
        {/* Left Sidebar */}
        <div className="col-span-2 flex flex-col pt-4 px-0 ">
          <SlideBar />
        </div>

        {/* Main Content */}
        <div className="col-span-8 flex justify-center bg-black px-0 min-h-screen">
          <div className="w-full max-w-2xl  min-h-screen flex flex-col border-x border-neutral-800">
            {/* Feed header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Trang chủ</h2>
              <Link to="/create-post"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
                title="Tạo bài viết mới"
              >
                <FaPlus className="text-lg" />
                <span className="hidden sm:inline">Tạo bài viết</span>
              </Link>
            </div>

            {/* Post list */}
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div key={post._id} className="flex justify-center items-center w-full border-b border-neutral-800 last:border-b-0">
                  <Card post={post} />
                </div>
              ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-2 flex flex-col pt-4 px-0 ">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default Home
