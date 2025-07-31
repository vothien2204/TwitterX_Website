import React, { useState } from 'react'
import SlideBar from '../components/SlideBar';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import ProfileMenu from '../components/ProfileMenu';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const userIns = JSON.parse(localStorage.getItem('userIns'));

  if (!userIns) {
    alert("Vui lòng đăng nhập để thực hiện chức năng này!");
    return <Navigate to="/login" />;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !caption.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);
      formData.append('userId', userIns.id);

      const response = await axios.post('/api/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 5000
      });

      if (response.status === 201) {
        alert('Đăng bài thành công!');
        setCaption('');
        setImageFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      if (error.response) {
        let errorMessage;
        if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
          errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau hoặc liên hệ admin.';
        } else {
          errorMessage = error.response.data?.message || error.response.data || error.response.statusText;
        }
        alert('Lỗi từ server: ' + errorMessage);
      } else if (error.request) {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và đảm bảo server đang chạy.');
      } else {
        alert('Có lỗi xảy ra: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="grid grid-cols-12 max-w-[1300px] mx-auto">
        {/* Left Sidebar */}
        <div className="col-span-2 flex flex-col pt-4 px-0 border-r border-neutral-800">
          <SlideBar />
        </div>
        
        {/* Main content */}
        <div className="col-span-8 flex justify-center min-h-screen px-0 bg-black">
          <div className="w-full max-w-xl  min-h-screen flex flex-col items-center pt-8">
            <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-8 py-8 shadow-xl mt-10">
              <h2 className="text-2xl font-bold mb-8 text-white text-center">Tạo bài viết mới</h2>
              <form onSubmit={handleSubmit}>
                {/* Upload ảnh */}
                <div className="mb-8">
                  <label className="block text-white mb-3 font-semibold">Ảnh bài viết</label>
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 block w-full text-sm text-neutral-300"
                      required
                    />
                    {previewUrl && (
                      <div className="mt-5">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-2xl max-h-64 max-w-xs object-cover border border-neutral-800 shadow"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Caption */}
                <div className="mb-8">
                  <label className="block text-white mb-3 font-semibold">Caption</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="4"
                    required
                    placeholder="Viết caption cho bài viết của bạn..."
                  />
                </div>
                {/* Nút đăng bài */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-500 text-white py-3 font-semibold text-lg hover:bg-blue-600 transition disabled:bg-neutral-700 disabled:text-neutral-400"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </form>
            </div>
          </div>
        </div>

        
        {/* Right Sidebar */}
        <div className="col-span-2 flex flex-col pt-4 px-0 border-l border-neutral-800">
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}

export default CreatePost
