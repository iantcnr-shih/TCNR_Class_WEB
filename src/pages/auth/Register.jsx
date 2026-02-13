import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 檢查密碼是否一致
    if (formData.password !== formData.confirmPassword) {
      alert('密碼與確認密碼不一致')
      return
    }

    console.log('註冊嘗試:', formData)
    alert('註冊功能尚未實作，這是展示頁面')
  }

  const handleSendCode = () => {
    if (!formData.email) {
      alert('請先輸入電子郵件')
      return
    }
    alert(`驗證碼已發送至 ${formData.email}`)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    alert('返回登入功能尚未實作')
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[rgb(255,255,255)] to-[#5e1f2b] flex justify-center items-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b] px-8 py-10 text-center text-white relative">
          {/* Home Button */}
          <div
            onClick={() => navigate('/')}
            className="absolute top-3 left-3 px-4 py-1 bg-white/20 hover:bg-white/30 
                     rounded-lg text-white text-sm font-medium transition-all duration-300
                     backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">建立帳號</h1>
          <p className="text-sm opacity-90">加入 TCNR Class，開始您的學習之旅</p>
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
              placeholder="請輸入密碼（至少 8 個字元）"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                       focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                       outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                       focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                       outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Verification Code */}
          <div className="mb-6">
            <label htmlFor="verificationCode" className="block mb-2 text-sm font-medium text-gray-700">
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
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm
                         focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 
                         outline-none transition-all duration-300 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="px-5 py-3 border-2 border-[#9f3a4b] text-[#9f3a4b] rounded-lg 
                         font-medium text-sm hover:bg-[#9f3a4b] hover:text-white 
                         transition-all duration-300 whitespace-nowrap"
              >
                發送驗證碼
              </button>
            </div>
          </div>

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
          <div className="text-center text-sm text-gray-600 mt-6">
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
      </div>
    </div>
  )
}

export default Register
