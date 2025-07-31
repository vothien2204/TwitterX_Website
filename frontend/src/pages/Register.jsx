import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/user/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: formData.bio
      });

      setSuccess(response.data.message);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md px-8 py-10 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800">
        {/* Logo X */}
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" rx="24" fill="#18181B" />
            <path d="M73 40H83L62 67L87 100H69L55.5 81.5L39 100H29L51.5 71L27 40H46L59 57L73 40ZM70.5 94H75L46.5 45.5H41.5L70.5 94Z" fill="white" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Tạo tài khoản</h1>
        {error && <div className="p-3 text-red-400 bg-red-900/30 rounded-md mb-2 border border-red-500/30">{error}</div>}
        {success && (
          <div className="p-3 text-green-400 bg-green-900/30 rounded-md mb-2 border border-green-500/30">
            {success}
            <br />
            <span className="text-green-300 text-sm">
              Vui lòng kiểm tra hộp thư đến (hoặc cả mục Spam) để kích hoạt tài khoản.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Tên người dùng"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mật khẩu"
              minLength={6}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              minLength={6}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={150}
              placeholder="Giới thiệu (tối đa 150 ký tự)"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-lg bg-white text-black rounded-full hover:bg-neutral-200 transition"
          >
            Đăng ký
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-neutral-400">Đã có tài khoản? </span>
          <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
