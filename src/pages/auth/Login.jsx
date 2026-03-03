import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "@/api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    captcha: ''
  })

  const [captchaUrl, setCaptchaUrl] = useState('');
  const [error, setError] = useState('');

  // 取得 captcha 圖片
  const loadCaptcha = async () => {
    const res = await api.get(`/my-captcha/default?ts=${Date.now()}`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'image/jpeg' });
    setCaptchaUrl(URL.createObjectURL(blob));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        if (res.data.auth) {
          navigate("/");
        }
      } catch (err) {

      }
    };
    fetchUser();
    loadCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 🔥 ① 先拿 CSRF Cookie（超重要）
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/login', formData);
      Swal.fire({
        title: "登入成功",
        icon: "success",
        draggable: true
      }).then((result) => {
        if (result.isConfirmed) {
          setError('');
          // 登入成功可以導向首頁
          navigate('/');
        }
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0][0];
        setError(firstError);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError('登入失敗');
      }

      setFormData(prev => ({
        ...prev,
        password: '',
        captcha: ''
      }));
      loadCaptcha();
    }
  }


  const handleForgotPassword = (e) => {
    e.preventDefault()
    alert('忘記密碼功能尚未實作')
  }

  const handleSignup = (e) => {
    e.preventDefault()
    alert('註冊功能尚未實作')
  }

  const handleSocialLogin = (provider) => {
    alert(`${provider} 登入功能尚未實作`)
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[rgb(255,255,255)] to-[#5e1f2b] flex justify-center items-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b] px-8 py-10 text-center text-white relative">
          {/* Home Button */}
          {/* <div
            onClick={() => navigate('/')}
            className="absolute top-3 left-3 px-4 py-1 bg-white/20 hover:bg-white/30 
                     rounded-lg text-white text-sm font-medium transition-all duration-300
                     backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </div> */}
          <div className="text-4xl lg:text-7xl font-semibold mb-2">TCNR Class</div>
          <p className="text-sm opacity-90">歡迎回來，請登入您的帳號</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-10">
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              電子郵件
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                       focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                       outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              密碼
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="請輸入您的密碼"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                       focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                       outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Captcha */}
          <div className="mb-6">
            <label htmlFor="captcha" className="block mb-2 text-sm font-medium text-gray-700">
              驗證碼
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                id="captcha"
                name="captcha"
                placeholder="請輸入驗證碼"
                value={formData.captcha}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                         focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                         outline-none transition-all duration-300 placeholder-gray-400"
              />

              {captchaUrl && (
                <div>
                  <img
                    src={captchaUrl}
                    onClick={loadCaptcha}
                    className="cursor-pointer select-none h-12 w-auto"
                    alt="captcha"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-5">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer accent-[#9f3a4b]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
              記住我
            </label>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <div
              onClick={handleForgotPassword}
              className="text-sm text-[#9f3a4b] hover:text-[#5e1f2b] transition-colors duration-300"
            >
              忘記密碼？
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b] text-white 
                     rounded-lg font-semibold text-base shadow-lg shadow-[#9f3a4b]/40
                     hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9f3a4b]/50
                     active:translate-y-0 transition-all duration-300"
          >
            登入
          </button>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">或使用以下方式登入</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 mb-6">
            <div
              onClick={() => handleSocialLogin('Google')}
              className="flex-1 text-center text-xl py-3 border-2 border-gray-200 rounded-lg font-medium text-sm
                       hover:border-[#9f3a4b] hover:bg-gray-50 transition-all duration-300 bg-[rgb(225,231,236)]"
            >
              Google
            </div>
            <div
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="flex-1 text-center text-xl py-3 border-2 border-gray-200 rounded-lg font-medium text-sm
                       hover:border-[#9f3a4b] hover:bg-gray-50 transition-all duration-300 bg-[rgb(225,231,236)]"
            >
              GitHub
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-600">
            還沒有帳號？
            <div
              onClick={() => navigate("/register")}
              className="ml-1 text-[#9f3a4b] font-semibold hover:text-[#5e1f2b] 
                       transition-colors duration-300"
            >
              立即註冊
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;