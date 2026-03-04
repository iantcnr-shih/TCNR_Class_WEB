import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "@/api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  })
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  // 🔥 發送驗證碼
  const handleSendCode = async () => {
    if (!formData.email) {
      Swal.fire({
        title: "請先輸入電子郵件",
        icon: "waring",
      });
      return;
    }

    try {
      Swal.fire({
        title: "電子郵件傳送中，請稍候！",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // 🔥 再送 POST
      await api.post("/api/send-code", {
        email: formData.email
      });
      Swal.fire({
        title: "驗證碼已寄出",
        text: "請前往信箱查看",
        icon: "success",
        confirmButtonText: "知道了",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "發送失敗",
        icon: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 檢查密碼是否一致
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "密碼與確認密碼不一致",
        icon: "warning",
      });
      return
    }
    setLoading(true);
    try {
      // 🔥 先取得 csrf-cookie
      await api.get("/sanctum/csrf-cookie");

      await api.post("/api/register", {
        email: formData.email,
        password: formData.password,
        code: formData.verificationCode,
      });
      Swal.fire({
        title: "註冊成功",
        text: "即將為您轉往登入頁面",
        icon: "success",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        let message = data.errors
          ? Object.values(data.errors)[0][0]
          : data.message || "發生未知錯誤";
        setErrorMessage(message);
        if (status === 400 && message === "驗證碼錯誤") {
          setFormData(prev => ({
            ...prev,
            verificationCode: ""
          }));
        }
      }
    }
    setLoading(false);
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
  }, []);

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
              <span className='text-3xl font-bold text-white'>註冊</span>
              <p className="text-md text-[rgba(255,255,255,0.6)]">
                歡迎加入，一起開始學習旅程
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
            歡迎加入，一起開始學習旅程
          </p>
          <span className='flex items-center justify-center ml-auto text-2xl text-[rgba(255,255,255,0.6)] mt-3 md:mt-5" md:hidden'>註冊</span>
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
              placeholder="請輸入密碼（至少 8 個字元）"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm
                        focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                        outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-md md:text-sm font-medium text-gray-700">
              確認密碼
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="請再次輸入密碼"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm
                        focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                        outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Verification Code */}
          <div className="mb-6">
            <label htmlFor="verificationCode" className="block mb-2 text-md md:text-sm font-medium text-gray-700">
              驗證碼
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                placeholder="請輸入驗證碼"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm
                          focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                          outline-none transition-all duration-300 placeholder-gray-400"
              />
              <div
                type="button"
                onClick={handleSendCode}
                className="px-3 sm:px-5 py-3 border-2 border-[#9f3a4b] text-[#9f3a4b] rounded-lg 
                          font-medium text-sm hover:bg-[#9f3a4b] hover:text-white 
                          transition-all duration-300 whitespace-nowrap"
              >
                發送驗證碼
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage &&
            <div className='flex w-full'>
              <p className="mx-auto text-red-500 mb-4 text-sm">{errorMessage}</p>
            </div>
          }

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b] text-white 
                      rounded-lg font-semibold text-base shadow-lg shadow-[#9f3a4b]/40
                      hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9f3a4b]/50
                      active:translate-y-0 transition-all duration-300"
          >
            註冊
          </button>

          {/* Login Link */}
          <div className="text-center text-md md:text-sm text-gray-600 mt-6">
            已經有帳號了？
            <span
              onClick={() => navigate("/login")}
              className="ml-1 text-[#9f3a4b] font-semibold hover:text-[#5e1f2b] 
                        transition-colors duration-300 cursor-pointer"
            >
              立即登入
            </span>
          </div>
        </form>
      </div >
    </div >
  )
}

export default Register
