import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITEKEY } from "@/config";
import Swal from "sweetalert2";
import api from "@/api/axios";

const STEPS = { EMAIL: 'email', OTP: 'otp', RESET: 'reset' };

const EyeIcon = ({ open }) => (
  open
    ? <Eye className="w-5 h-5" />
    : <EyeOff className="w-5 h-5" />
);

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

function ForgotPassword() {
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [resetToken, setResetToken] = useState("");

  const [formData, setFormData] = useState({
    email: '',
    captchaToken: ''
  })

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpRef0 = useRef(); const otpRef1 = useRef(); const otpRef2 = useRef();
  const otpRef3 = useRef(); const otpRef4 = useRef(); const otpRef5 = useRef();
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5];

  const brandGrad = { background: "linear-gradient(160deg, #9f3a4b 0%, #4a1220 100%)" };
  const stepLabels = ['輸入信箱', '驗證碼', '重設密碼'];
  const stepIndex = step === STEPS.EMAIL ? 0 : step === STEPS.OTP ? 1 : 2;

  // ── Helpers ────────────────────────────────────────────────────
  const getPasswordStrength = (pw) => {
    if (pw.length < 4) return 1;
    if (pw.length >= 6 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) return 4;
    if (pw.length >= 5 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return 3;
    return 2;
  };
  const strengthLabel = ['', '太短', '普通', '強', '非常強'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

  // ── Handlers ───────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.captchaToken) {
      Swal.fire({
        title: "請完成安全驗證",
        icon: "warning",
      });
      return;
    }
    setError(''); setLoading(true);
    try {
      const res = await api.post('/api/forgot-password-code', { email: formData.email, 'g-recaptcha-response': formData.captchaToken });
      if (res.status === 200) {
        Swal.fire({
          title: "驗證碼已發送",
          text: "請查收您的電子郵件",
          icon: "success",
          confirmButtonText: "知道了",
        });
        setStep(STEPS.OTP);
      }
    } catch (err) {
      setError(err.response?.data?.message || '發送失敗，請確認電子郵件是否正確');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('請輸入完整的驗證碼'); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/verify-otp', { email: formData.email, otp: code });
      if (res.status === 200) {
        setResetToken(res.data.reset_token);
        Swal.fire({
          title: "驗證成功",
          text: "請重設密碼",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        setStep(STEPS.RESET);
      }
    } catch (err) {
      setError(err.response?.data?.message || '驗證碼錯誤或已過期');
      setOtp(['', '', '', '', '', '']);
      otpRefs[0].current?.focus();
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setError('');
    if (passwords.password !== passwords.confirm) { setError('兩次密碼輸入不一致'); return; }
    if (passwords.password.length < 4) { setError('密碼至少需要 4 個字元'); return; }
    setLoading(true);
    try {
      await api.post('/api/reset-password', {
        email: formData.email, otp: otp.join(''),
        reset_token: resetToken,
        password: passwords.password,
        password_confirmation: passwords.confirm,
      });
      Swal.fire({ title: "密碼重設成功", text: "請使用新密碼登入", icon: "success" }).then(() => navigate('/login'));
    } catch (err) {
      setError(err.response?.data?.message || '密碼重設失敗');
      Swal.fire({ title: err.response?.data?.message || '密碼重設失敗', text: "請重新操作", icon: "error" }).then(() => window.location.reload());
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value.slice(-1); setOtp(newOtp);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const submitBtnClass = "w-full py-3.5 bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b] text-white rounded-lg font-semibold text-base shadow-lg shadow-[#9f3a4b]/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9f3a4b]/50 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0";
  
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

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[rgb(255,249,252)]">

      {/* ── LEFT PANEL ── */}
      <div
        style={brandGrad}
        className="relative overflow-hidden flex flex-col justify-between w-full md:w-5/12 md:max-w-[360px] md:min-h-screen p-4 md:px-12 md:py-14"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute bottom-10 -left-16 w-48 h-48 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-rose-200 opacity-10 pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex gap-3">
            <div
              className="w-12 h-12 bg-gradient-to-br from-[#FC801C] to-[#BB496B] rounded-lg flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:brightness-110 cursor-pointer"
              onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <span className="flex items-center text-white text-xl font-medium tracking-widest uppercase" style={{ opacity: 0.75 }}>
              TCNR Class
            </span>
          </div>
          <div className="hidden md:block mt-5">
            <span className="text-3xl font-bold text-white">忘記密碼</span>
            <p className="text-md text-[rgba(255,255,255,0.6)]">我們將協助您重設密碼</p>
          </div>
          <div className="hidden md:block">
            <div className="w-10 h-0.5 my-6" style={{ background: "rgba(255,255,255,0.3)" }} />
            <div className="mb-8 space-y-5">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-500 ${i < stepIndex ? 'bg-white text-[#9f3a4b]' :
                    i === stepIndex ? 'bg-white text-[#9f3a4b] ring-4 ring-white/20' :
                      'border-2 border-white/30 text-white/40'
                    }`}>
                    {i < stepIndex
                      ? <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : i + 1}
                  </div>
                  <p className={`text-sm font-medium transition-all duration-300 ${i === stepIndex ? 'text-white' : i < stepIndex ? 'text-white/70' : 'text-white/30'}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Desktop step progress */}
        <div className="relative z-10 hidden md:block">
          <h1 className="text-white text-4xl lg:text-5xl leading-tight mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600 }}>
            學習，從<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,220,210,0.9)" }}>這裡</em>開始。
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            專為學員打造的線上學習平台，精心設計每一堂課程，陪伴你踏上成長之旅。
          </p>
        </div>

        <div className="hidden md:block">
        </div>

        {/* Footer */}
        <div className="relative z-10 hidden md:flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            <div className="w-5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 TCNR Class</span>
        </div>

        {/* Mobile subtitle */}
        <div className="flex px-3 md:hidden">
          <p className="relative z-10 text-md text-[rgba(255,255,255,0.6)] mt-3">我們將協助您重設密碼</p>
          <span className="ml-auto text-2xl text-[rgba(255,255,255,0.6)] mt-3">忘記密碼</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-3 py-6 sm:px-5">
        <div className="w-full max-w-md px-6 py-8">

          {/* Mobile step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 md:hidden">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < stepIndex ? 'bg-[#9f3a4b] text-white' :
                    i === stepIndex ? 'bg-[#9f3a4b] text-white ring-4 ring-[#9f3a4b]/20' :
                      'border-2 border-gray-200 text-gray-400'
                    }`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${i === stepIndex ? 'text-[#9f3a4b] font-medium' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`w-6 h-0.5 transition-all duration-300 ${i < stepIndex ? 'bg-[#9f3a4b]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Email ── */}
          {step === STEPS.EMAIL && (
            <form onSubmit={handleSendOtp} className='mt-12'>
              <h2 className="text-2xl font-bold text-gray-800">輸入您的信箱</h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">我們將發送驗證碼至您的電子郵件</p>

              <div className="mb-6">
                <label className="block mb-2 text-md md:text-sm font-medium text-gray-700">電子郵件</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-md md:text-sm focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 outline-none transition-all duration-300 placeholder-gray-400"
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

              {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}

              <button type="submit" disabled={loading} className={submitBtnClass}>
                {loading ? <span className="flex items-center justify-center gap-2"><Spinner />發送中...</span> : '發送驗證碼'}
              </button>

              <div className="text-center mt-6 text-md text-gray-600">
                想起密碼了？
                <span onClick={() => navigate('/login')} className="ml-1 text-[#9f3a4b] font-semibold hover:text-[#5e1f2b] transition-colors duration-300 cursor-pointer">
                  返回登入
                </span>
              </div>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="text-2xl font-bold text-gray-800">輸入驗證碼</h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">
                驗證碼已發送至 <span className="text-[#9f3a4b] font-medium">{formData.email}</span>
              </p>

              <div className="mb-6">
                <label className="block mb-3 text-md md:text-sm font-medium text-gray-700">6 位數驗證碼</label>
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all duration-300
                        ${digit ? 'border-[#9f3a4b] bg-[#9f3a4b]/5 text-[#9f3a4b]' : 'border-gray-200 text-gray-800'}
                        focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10`}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}

              <button type="submit" disabled={loading} className={submitBtnClass}>
                {loading ? <span className="flex items-center justify-center gap-2"><Spinner />驗證中...</span> : '驗證'}
              </button>

              <div className="text-center mt-6 text-md text-gray-500">
                沒有收到驗證碼？
                <span
                  onClick={() => { setStep(STEPS.EMAIL); setError(''); setOtp(['', '', '', '', '', '']); }}
                  className="ml-1 text-[#9f3a4b] font-semibold hover:text-[#5e1f2b] transition-colors duration-300 cursor-pointer"
                >
                  重新發送
                </span>
              </div>
            </form>
          )}

          {/* ── STEP 3: Reset Password ── */}
          {step === STEPS.RESET && (
            <form onSubmit={handleResetPassword}>
              <h2 className="text-2xl font-bold text-gray-800">重設密碼</h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">請設定您的新密碼，至少 4 個字元</p>

              {/* New password */}
              <div className="mb-6">
                <label className="block mb-2 text-md md:text-sm font-medium text-gray-700">新密碼</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.password}
                    onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="請輸入新密碼"
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg text-md md:text-sm  focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10 outline-none transition-all duration-300 placeholder-gray-400"
                  />
                  <div type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9f3a4b] transition-colors duration-200">
                    <EyeIcon open={showPassword} />
                  </div>
                </div>
                {passwords.password && (() => {
                  const s = getPasswordStrength(passwords.password);
                  return (
                    <div className="mt-4 ml-3">
                      <div className="flex w-[50%] gap-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${lvl <= s ? strengthColor[s] : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-gray-400">密碼強度：{strengthLabel[s]}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Confirm password */}
              <div className="mb-6">
                <label className="block mb-2 text-md md:text-sm font-medium text-gray-700">確認新密碼</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="請再次輸入新密碼"
                    required
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-md md:text-sm outline-none transition-all duration-300 placeholder-gray-400
                      ${passwords.confirm && passwords.confirm !== passwords.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-400/10'
                        : passwords.confirm && passwords.confirm === passwords.password
                          ? 'border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/10'
                          : 'border-gray-200 focus:border-[#9f3a4b] focus:ring-4 focus:ring-[#9f3a4b]/10'
                      }`}
                  />
                  <div type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9f3a4b] transition-colors duration-200">
                    <EyeIcon open={showConfirm} />
                  </div>
                </div>
                {passwords.confirm && passwords.confirm !== passwords.password && (
                  <p className="text-xs text-red-500 mt-1.5">兩次密碼輸入不一致</p>
                )}
                {passwords.confirm && passwords.confirm === passwords.password && (
                  <p className="text-xs text-green-500 mt-1.5">✓ 密碼一致</p>
                )}
              </div>

              {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}

              <button type="submit" disabled={loading} className={submitBtnClass}>
                {loading ? <span className="flex items-center justify-center gap-2"><Spinner />重設中...</span> : '確認重設密碼'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
