import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setResendMessage('');

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Email không đúng định dạng');
        return;
      }

      if (password.length < 6) {
        setError('Mật khẩu tối thiểu 6 ký tự');
        return;
      }

      const response = await axios.post('/api/user/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (response.data) {
        localStorage.setItem('userIns', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data.message || 'Tài khoản chưa được xác thực.');
        setShowResend(true); // Hiện nút gửi lại mã xác thực
      } else if (error.response?.status === 404) {
        setError(error.response.data.message || 'Không tìm thấy người dùng. Kiểm tra lại email và mật khẩu.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Mật khẩu không đúng. Vui lòng thử lại.');
      } else {
        setError(error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  // Gửi lại mã xác thực
  const handleResend = async () => {
    setResendMessage('');
    setIsResending(true);
    try {
      const res = await axios.post('/api/user/resend-activation', { email: email.trim() });
      setResendMessage(res.data.message || 'Đã gửi lại email xác thực!');
    } catch (err) {
      setResendMessage(
        err.response?.data?.message ||
        'Không thể gửi lại mã xác thực. Vui lòng thử lại sau.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md px-8 py-10 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800">
        {/* Logo X */}
        <div className="flex justify-center mb-6">
          {/* X logo svg giống X/Twitter */}
          <svg width="48" height="48" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" rx="24" fill="#18181B"/>
            <path d="M73 40H83L62 67L87 100H69L55.5 81.5L39 100H29L51.5 71L27 40H46L59 57L73 40ZM70.5 94H75L46.5 45.5H41.5L70.5 94Z" fill="white"/>
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Đăng nhập Twitter X</h1>
        
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 rounded-md mb-2 border border-red-500/30">
            {error}
            {/* Nếu lỗi là chưa xác thực, hiển thị nút gửi lại mã */}
            {showResend && (
              <div className="flex flex-col items-center mt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
                >
                  {isResending ? 'Đang gửi...' : 'Gửi lại mã xác thực'}
                </button>
                {resendMessage && (
                  <div className={`mt-2 text-sm ${resendMessage.includes('không') ? 'text-red-400' : 'text-green-400'}`}>
                    {resendMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Mật khẩu"
              minLength={6}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-lg bg-white text-black rounded-full hover:bg-neutral-200 transition"
          >
            Đăng nhập
          </button>
        </form>
        <p className="mt-6 text-center text-neutral-400 text-sm">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
