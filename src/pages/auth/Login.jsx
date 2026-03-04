import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITEKEY } from "@/config";
import Swal from "sweetalert2";
import api from "@/api/axios";

function Login() {
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    captchaToken: ''
  })

  const [error, setError] = useState('');

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
      if (!formData.captchaToken) {
        Swal.fire({
          title: "請完成安全驗證",
          icon: "warning",
        });
        return;
      }
      const res = await api.post('/api/login', {
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
        'g-recaptcha-response': formData.captchaToken, // <- 對應官方token
      });
      // 儲存 token
      localStorage.setItem('auth_token', res.data.token);
      // 後續 API 帶上 header
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
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
        captchaToken: ''
      }));
    } finally {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  }

  const handleSocialLogin = (provider) => {
    alert(`${provider} 登入功能尚未實作`)
  }

  // Brand gradients via inline style (Tailwind JIT not available at runtime)
  const brandGrad = { background: "linear-gradient(160deg, #9f3a4b 0%, #4a1220 100%)" };
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[rgb(255,249,252)]">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        style={brandGrad}
        className={`relative overflow-hidden flex flex-col justify-between w-full md:w-5/12 md:max-w-[360px] md:min-h-screen
          p-4 md:px-12 md:py-14 transition-all duration-700 opacity-100 translate-x-0
        `}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute bottom-10 -left-16 w-48 h-48 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-rose-200 opacity-10 pointer-events-none" />

        {/* Brand mark */}
        <div className="relative z-10 items-center gap-3">
          <div className='flex gap-3'>
            <div className="w-12 h-12 bg-gradient-to-br from-[#FC801C] to-[#BB496B] rounded-lg flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:brightness-110"
              onClick={() => {
                navigate("/");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }}
            >
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <span className="flex items-center justify-center text-white text-xl font-medium tracking-widest uppercase" style={{ opacity: 0.75 }}>
              TCNR Class
            </span>
          </div>
          <div className='flex w-full mt-5 hidden md:block'>
            <div className='mx-auto'>
              <span className='text-3xl font-bold text-white'>登入</span>
              <p className="text-md text-[rgba(255,255,255,0.6)]">
                歡迎回來，請登入您的帳號
              </p>
            </div>
          </div>
        </div>

        {/* Hero — desktop only */}
        <div className="relative z-10 hidden md:block">
          <div className="w-10 h-0.5 mb-6" style={{ background: "rgba(255,255,255,0.3)" }} />
          <h1 className="text-white text-4xl lg:text-5xl leading-tight mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600 }}>
            學習，從<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,220,210,0.9)" }}>這裡</em>開始。
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            專為學員打造的線上學習平台，精心設計每一堂課程，陪伴你踏上成長之旅。
          </p>
        </div>

        {/* Footer dots — desktop */}
        <div className="relative z-10 hidden md:flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            <div className="w-5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 TCNR Class</span>
        </div>

        {/* Mobile sub-title */}
        <div className='flex px-3'>
          <p className="relative z-10 md:hidden text-md text-[rgba(255,255,255,0.6)] mt-3 md:mt-5">
            歡迎回來，請登入您的帳號
          </p>
          <span className='flex items-center justify-center ml-auto text-2xl text-[rgba(255,255,255,0.6)] mt-3 md:mt-5" md:hidden'>登入</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className={`flex-1 flex items-center justify-center px-3 py-2 sm:px-5 transition-all duration-700 delay-150 opacity-100 translate-x-0`}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md px-6 py-8">
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-md md:text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm
                        focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10
                        outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-md md:text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm
                        focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10
                        outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Captcha */}
          <div className="mb-6">
            <label htmlFor="captcha" className="block mb-2 text-md md:text-sm font-medium text-gray-700">
              安全驗證
            </label>
            <div className='flex w-full'>
              <div className="mr-auto md:scale-90 origin-top-left">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITEKEY}
                  onChange={(token) => setFormData(prev => ({ ...prev, captchaToken: token }))}
                />
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center ml-2 mb-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className={`w-5 h-5 rounded-sm border-2 border-gray-300 appearance-none checked:bg-[#9f3a4b] checked:border-[#9f3a4b] relative flex-shrink-0
                              before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                              before:w-2 before:h-3 before:border-b-2 before:border-r-2 before:border-white before:rotate-45 before:hidden
                              checked:before:block transition-all
                            `}
                />
                <span className="ml-2 text-md md:text-sm text-gray-600 select-none">記住我</span>
              </label>
            </div>

            {/* Forgot Password */}
            <div className="text-right mr-2 mb-2">
              <div
                onClick={()=> navigate("/forgotpassword")}
                className="text-md md:text-sm text-[#9f3a4b] hover:text-[#5e1f2b] transition-colors duration-300"
              >
                忘記密碼？
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error &&
            <div className='flex w-full'>
              <p className="mx-auto text-red-500 mb-4 text-sm">{error}</p>
            </div>
          }

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
          <div className="relative my-6">
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
          <div className="text-center text-md md:text-sm text-gray-600">
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
      </div >
    </div >
  );
}
export default Login;