import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/auth/UserProvider";
import useUnsavedChangesWarning from "@/components/tools/useUnsavedChangesWarning";
import Swal from "sweetalert2";
import api from "@/api/axios";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */
const activityLog = [
  { icon: "💬", text: "在知識論壇發表《React Server Components 使用時機》", time: "2 小時前", color: "blue" },
  { icon: "✅", text: "完成 Week 5 作業：Hooks 深入實作", time: "1 天前", color: "emerald" },
  { icon: "🏆", text: "積分排行榜第 1 名，連續登入 14 天", time: "1 天前", color: "orange" },
  { icon: "📋", text: "出席第一次班務會議並完成選舉投票", time: "9 天前", color: "red" },
  { icon: "🎓", text: "完成課程報到，帳號已啟用", time: "33 天前", color: "gray" },
];

const badges = [
  { icon: "🔥", label: "連續 14 天", desc: "每日登入", earned: true },
  { icon: "🥇", label: "排行第 1", desc: "積分榜冠軍", earned: true },
  { icon: "💬", label: "活躍貢獻者", desc: "發文 10 篇+", earned: true },
  { icon: "✅", label: "全勤學員", desc: "出席率 100%", earned: true },
  { icon: "🚀", label: "Demo Day", desc: "展示專案", earned: false },
  { icon: "🎯", label: "結業認證", desc: "完成課程", earned: false },
];

const avatarOptions = [ "🦊", "🐼", "🐸", "🦁", "🐙", "🚀", "🌸", "🧪", "🗄️", "🤖", "⚡", "✨", "🐳", "🎭", "🔧",
  "🧠", "📱", "🎯", "🛡️", "🌊", "☁️", "🖌️", "⚙️", "📊", "🌈", "🎮", "🔢", "🔐", "🏗️", "🎨", "🎪", "🤯", "❄️", "🌱"
];

// const skillOptions = ["React", "Vue", "Angular", "Node.js", "Express", "TypeScript", "JavaScript", "Python", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git", "Figma", "GraphQL", "Redis"];

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */

const activityDot = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon, title }) => (
  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm md:text-base">
    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{icon}</span>
    {title}
  </h3>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, disabled, readOnly, onClick }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}       // 🔹 這裡
      onClick={onClick}          // 🔹 這裡
      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all outline-none
        ${readOnly || disabled
          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
          : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-800"}`}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  disabled,
  placeholder = "請選擇"
}) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>

    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all outline-none
        ${disabled
          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
          : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-800"}`}
    >
      <option value="">{placeholder}</option>

      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {opt.position_name}
        </option>
      ))}
    </select>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════ */
function Toast({ msg, onDone }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 animate-bounce"
      style={{ animation: "fadeInUp 0.3s ease" }}
    >
      ✅ {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 個人資料
═══════════════════════════════════════════════════════════════════════ */
export default function Profile() {
  const fetchedRef = useRef(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [gotoAuthorize, setGotoAuthorize] = useState(false);
  const [tab, setTab] = useState("baseinfo");
  const [profile, setProfile] = useState({ skills: [] });
  const [avatarEditing, setAvatarEditing] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [skillEditing, setSkillEditing] = useState(false);
  const [draft, setDraft] = useState({ skills: [] });
  const [toast, setToast] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    forum: true,
    course: true,
    meeting: false,
    career: true,
    email: false,
  });
  const [skillOptions, setSkillOptions] = useState([]);
  const [positionList, setPositionList] = useState([]);

  // 避免未儲存更新頁面
  const hasUnsavedChanges = avatarEditing || profileEditing || skillEditing;
  useUnsavedChangesWarning(hasUnsavedChanges);

  const tabs = [
    ["baseinfo", "👤", "基本資料"],
    ["activity", "📋", "活動紀錄"],
    ["badges", "🏆", "成就徽章"],
    ["settings", "⚙️", "帳號設定"],
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleProfileSaveAPI = async (profiledata) => {
    const result = await Swal.fire({
      title: "確定儲存?",
      text: "儲存本次變更",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1ec22c",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await api.post("/api/user/updateprofile", { profiledata });

          if (!res.data?.success) {
            throw new Error(res.data?.message || "儲存失敗");
          }

          return res.data;
        } catch (error) {
          Swal.showValidationMessage(error.message || "儲存發生錯誤");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      // ✅ API 成功後再更新 state
      setProfile(draft);
      setProfileEditing(false);
      showToast("個人資料已儲存");

      Swal.fire({
        title: "儲存成功",
        icon: "success",
      });
    }
  }

  const handleSkillsSaveAPI = async (skillsdata) => {
    const result = await Swal.fire({
      title: "確定儲存?",
      text: "儲存本次變更",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1ec22c",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await api.post("/api/user/updateUserSkills", { skillsdata });

          if (!res.data?.success) {
            throw new Error(res.data?.message || "儲存失敗");
          }
          return res.data;
        } catch (error) {
          Swal.showValidationMessage(error.message || "儲存發生錯誤");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      // ✅ API 成功後再更新 state
      setProfile(draft);
      setSkillEditing(false);
      showToast("個人資料已儲存");

      Swal.fire({
        title: "儲存成功",
        icon: "success",
      });
    }
  }

  const handleUserAvatarSave = async (avatar) => {
    try {
      const res = await api.post("/api/user/updateAvatar", { avatar });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "儲存失敗");
      }

      setProfile({...profile, avatar: res.data.avatar || ""});

      Swal.fire({
        title: "頭像儲存成功",
        icon: "success",
      });
    } catch (error) {
      Swal.showValidationMessage(error.message || "儲存發生錯誤");
    }
  }

  const handleProfileSave = async () => {
    const requiredFields = [
      { key: "user_name", label: "姓名" },
      { key: "seat_number", label: "座號" },
      { key: "email", label: "E-mail" },
    ];

    const emptyFields = requiredFields.filter(f => !draft[f.key] || draft[f.key].trim() === "");
    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "欄位資料錯誤",
        text: "以下欄位為必填：" + emptyFields.map(f => f.label).join(", ")
      });
      return;
    }

    // 2️⃣ 檢查座號是否大於0的整數
    const seatNumber = Number(draft.seat_number);
    if (!Number.isInteger(seatNumber) || seatNumber <= 0) {
      Swal.fire({
        icon: "error",
        title: "欄位錯誤",
        text: "座號必須是大於 0 的整數"
      });
      return;
    }

    // Email 格式檢查（可選，readOnly 也安全）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draft.email)) {
      Swal.fire({
        icon: "error",
        title: "欄位錯誤",
        text: "Email 格式不正確"
      });
      return;
    }

    // 4️⃣ GitHub / LinkedIn 補 https://
    const normalizeUrl = (url) => {
      if (!url) return "";
      return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    };

    const draftToCheck = {
      ...draft,
      github: normalizeUrl(draft.github),
      linkedin: normalizeUrl(draft.linkedin),
    };
    setDraft(draftToCheck);

    // 送出前先移除 skills 屬性, skills 不在這裡編輯
    const { skills, ...payload } = draftToCheck;

    const draftToSend = {
      ...payload,
    };
    // 通過驗證再送出 API
    handleProfileSaveAPI(draftToSend);
  };

  const handleProfileCancel = () => {
    setDraft(profile);
    setProfileEditing(false);
    setShowAvatarPicker(false);
  };

  const toggleSkill = (skillId) => {
    setDraft(d => {
      // 🔹 防止 d.skills 未定義
      const skills = Array.isArray(d.skills) ? d.skills : [];

      const has = skills.includes(skillId);
      return {
        ...d,
        skills: has
          ? skills.filter(s => s !== skillId)
          : [...skills, skillId],
      };
    });
  };

  const handleSkillsSave = () => {
    const draftToSend = {
      user_id: draft.user_id,
      skills: draft?.skills.join(","),
    };

    // 通過驗證再送出 API
    handleSkillsSaveAPI(draftToSend);
  }

  const handleSkillsCancel = () => {
    setDraft(profile);
    setSkillEditing(false);
  }

  const addCustomSkill = async () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    try {
      // 送到後端新增技能
      const res = await api.post("/api/skills/add", { skill_name: trimmedSkill });

      if (res.data?.success) {
        const newSkillFromServer = res.data.skill; // 後端回傳 { id, skill_name }

        // 更新 skillOptions
        setSkillOptions(prev => [...prev, newSkillFromServer]);

        // 選中新增的技能
        setDraft(prev => ({
          ...prev,
          skills: [...prev.skills, newSkillFromServer.id],
        }));

        setNewSkill(""); // 清空輸入框
      } else {
        Swal.fire({
          title: "新增技能失敗",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "新增技能發生錯誤",
        text: "技能已存在, 或已被管理者排除使用",
        icon: "error",
      });
    }
  };

  const handlePwSave = async () => {
    // 簡單驗證
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      Swal.fire({
        title: "請填寫所有欄位",
        icon: "warning",
      });
      return;
    }

    if (pwForm.next.length < 4) {
      Swal.fire({
        title: "新密碼至少 4 個字元",
        icon: "warning",
      });
      return;
    }

    if (pwForm.next !== pwForm.confirm) {
      Swal.fire({
        title: "新密碼與確認密碼不一致",
        icon: "warning",
      });
      return;
    }

    try {
      const res = await api.post("/api/user/updatePassword", {
        current_password: pwForm.current,
        new_password: pwForm.next,
        confirm_password: pwForm.confirm
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "更新密碼失敗");
      }

      await Swal.fire({
        title: "密碼更新成功",
        html: `<div class="text-red-500 text-md">系統即將為您登出，請使用新的設定密碼重新登入</div>`,
        icon: "success",
      });
      // 4️⃣ 清空表單
      setPwForm({ current: "", next: "", confirm: "" });

      // 5️⃣ 呼叫登出 API（失敗也不影響流程）
      await api.post("/api/logoutAll").catch(() => { });

      // 6️⃣ 清除前端登入資訊，導向登入頁
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "更新密碼發生錯誤",
        text: error.response?.data?.message || error.message || "更新密碼失敗",
        icon: "error",
      });
    }
  };

  const handleLogoutAllDevices = async () => {
    const result = await Swal.fire({
      title: "確定要登出所有裝置嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定登出",
      cancelButtonText: "取消",
    });

    if (!result.isConfirmed) return;
    try {
      const res = await api.post("/api/logoutAll");
      if (res.data.success) {
        Swal.fire({
          title: "已登出所有裝置",
          icon: "success",
        }).then(() => {
          localStorage.removeItem("auth_token");
          delete api.defaults.headers.common["Authorization"];
          navigate("/login");
        });
      } else {
        Swal.fire({
          title: "登出失敗",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "發生錯誤",
        icon: "error",
      });
    }
  };

  const deactivateAccount = async () => {
    const result = await Swal.fire({
      title: "確定要停用帳號？",
      text: "停用後將立即登出，需聯絡管理員才能恢復",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定停用",
      cancelButtonText: "取消",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.post("/api/user/deactivate");

      if (res.data.success) {
        await Swal.fire({
          title: "帳號已停用",
          icon: "success",
        });

        // 清除登入狀態
        localStorage.removeItem("auth_token");
        delete api.defaults.headers.common["Authorization"];
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        title: "停用失敗",
        text: error.response?.data?.message || "請稍後再試",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const fetchGetSkills = async () => {
      try {
        const res = await api.get("/api/getAllSkills");
        if (res.status === 200) {
          const allskills = res.data.AllSkills
          setSkillOptions(allskills)
        }
      } catch (error) {
        console.log("getSkills error:", error);
      }
    }
    fetchGetSkills();
    const fetchGetPositions = async () => {
      try {
        const res = await api.get("/api/GetPositions");
        if (res.status === 200) {
          const positions = res.data.AllPositions
          setPositionList(positions)
        }
      } catch (error) {
        console.log("getSkills error:", error);
      }
    }
    fetchGetPositions();
  }, [])

  useEffect(() => {
    if (!isAuthorized || (!isAuthorized && gotoAuthorize)) {
      Swal.fire({
        icon: "info",
        title: "請輸入密碼授權",
        input: "password",
        inputPlaceholder: "Password",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "current-password",
        },
        showCancelButton: true,
        confirmButtonText: "驗證",
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
          try {
            const res = await api.post("/api/verify-password", { password });
            if (!res.data?.success) {
              throw new Error(res.data?.message || "驗證失敗");
            }
            return res.data;
          } catch (error) {
            Swal.showValidationMessage(
              error.response?.data?.message || error.message || "驗證失敗"
            );
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          // 驗證成功
          setIsAuthorized(true); // 將 state 設為已授權
          Swal.fire("驗證成功", "你已經通過密碼驗證", "success");
        } else {
          setGotoAuthorize(false);
        }
      });
    }

  }, [isAuthorized, gotoAuthorize]);

  const askSeatNumber = async () => {
    // Step 1：輸入座號
    const { value } = await Swal.fire({
      title: "座號尚未設定",
      text: "請輸入您的個人座號",
      input: "text",
      inputAttributes: {
        inputmode: "numeric",
        pattern: "[0-9]*"
      },
      inputPlaceholder: "例如：25",
      showCancelButton: false,
      confirmButtonText: "下一步",
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value) return "座號不能為空";
        if (!/^\d+$/.test(value)) return "座號只能是整數";
        const num = parseInt(value, 10);
        if (num <= 0) return "座號必須大於0";
        if (num > 29) return "已超出本班人數";
      }
    });

    if (!value) return; // 保險起見

    // Step 2：二次確認
    const confirmResult = await Swal.fire({
      title: "請確認座號",
      html: `您輸入的座號是 
                  <span style="color:red; font-size:1.5rem; font-weight:bold;">${value}</span> 號，確定送出嗎?<br/><br/>
                  <div style="color:red;">注意：資料送出後無法再做變更!</div>
                `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定送出",
      cancelButtonText: "取消"
    });

    if (!confirmResult.isConfirmed) {
      // 按取消 → 重新打開輸入框
      await askSeatNumber();
      return;
    }

    // Step 3：送出 API
    try {
      const res = await api.post("/api/user/setSeatNumber", { seat_number: value });
      if (res.status === 200) {
        setProfile(res.data.profile);
        setDraft(res.data.profile);
        const user_data = {
          ...user,
          user: res.data.user
        }
        setUser(user_data);
        Swal.fire({
          title: "座位設定成功",
          icon: 'success',
        });
      }
    } catch (error) {
      // Step 4：處理後端座號已設定的情況
      if (error.response?.status === 409) {
        // 後端回傳 409
        await Swal.fire({
          title: "設定失敗",
          text: error.response.data.message, // 正確取錯誤訊息
          icon: "error"
        });
        return askSeatNumber(); // 重新輸入
      }

      Swal.showValidationMessage(
        `送出失敗: ${error.response?.data?.message || error.message}`
      );
      // 可以選擇再呼叫 askSeatNumber() 讓使用者重試
    }
  };

  useEffect(() => {
    if (!isAuthorized || fetchedRef.current) return;
    fetchedRef.current = true;
    const controller = new AbortController();
    const fetchGetUserProfile = async () => {
      try {
        const res = await api.get('/api/user/profile', { signal: controller.signal });
        if (res.status === 200) {
          if (res.data.hasProfile === false) {
            // 🔥 呼叫一次開始流程
            askSeatNumber();
            return;
          } else {
            setProfile(res.data.profile);
            setDraft(res.data.profile);
          }
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.log("GetUserProfile error:", error);
        }
      }
    }
    fetchGetUserProfile();
    return () => controller.abort();
  }, [isAuthorized])

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen" style={{ fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" }}>
      {toast && <Toast msg={toast} />}

      <PageHeader title="個人資料" subtitle="管理你的帳號資訊、查看學習成就與偏好設定" />
      {isAuthorized && (
        <Card className="p-5 md:p-6 mb-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-red-50 ring-4 ring-red-100 flex items-center justify-center text-4xl md:text-5xl cursor-pointer select-none"
                onClick={() => avatarEditing && setShowAvatarPicker(p => !p)}>
                {profile.avatar || "👨‍💻"}
              </div>
              {/* {avatarEditing && ( */}
              <div onClick={() => setShowAvatarPicker(p => !p)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-800 rounded-full text-white text-xs flex items-center justify-center shadow-md cursor-pointer hover:bg-red-900 transition-colors">
                ✏️
              </div>
              {/* )} */}
            </div>

            {/* Avatar picker */}
            {showAvatarPicker && (
              <div className="absolute z-20 mt-26 ml-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 grid grid-cols-8 gap-2 w-96">
                {avatarOptions.map(a => (
                  <div key={a} onClick={() => { setDraft(d => ({ ...d, avatar: a })); handleUserAvatarSave(a); setShowAvatarPicker(false); }}
                    className={`flex items-center justify-center text-2xl p-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer ${draft.avatar === a ? "bg-red-100 ring-2 ring-red-400" : ""}`}>
                    {a}
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
                <p className="text-xl md:text-2xl font-black text-gray-900">{profile.user_en_name || profile.user_nick_name || profile.user_name}</p>
                <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-bold self-center">2026 第一期</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xl">
                {profile.bio && profile.bio.length > 120
                  ? `${profile.bio.slice(0, 120)}...`
                  : profile.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                {profile.skills
                  .filter(skillId => skillOptions.some(s => s.id === skillId)) // 過濾不存在的 id
                  .map((skillId, idx) => {
                    const skillObj = skillOptions.find(s => s.id === skillId);
                    return (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium"
                      >
                        {skillObj.skill_name}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100 flex-wrap">
            {[["14", "連續登入天數"], ["98", "積分"], ["5", "論壇發文"], ["87%", "作業完成率"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-xl md:text-2xl font-black text-red-800">{val}</p>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Profile hero card */}


      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
        {tabs.map(([key, icon, label]) => (
          <div key={key} onClick={() => setTab(key)}
            className={`px-4 md:px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 -mb-px cursor-pointer whitespace-nowrap flex-shrink-0 transition-all
              ${tab === key ? "bg-red-50 text-red-800 border-red-700" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
            {icon} {label}
          </div>
        ))}
      </div>

      {/* ── 基本資料 ─────────────────────────────────────────── */}
      {tab === "baseinfo" ? isAuthorized ? (
        <div className="space-y-5 max-w-3xl">
          <Card className="p-5 md:p-6">
            <div className="w-full flex">
              <SectionTitle icon="👤" title="個人資訊" />
              {/* Edit button */}
              <div className="flex-shrink-0 ml-auto">
                {profile?.user_name && (!profileEditing
                  ? <div onClick={() => { setDraft(profile); setProfileEditing(true); }}
                    className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                    ✏️ 編輯
                  </div>
                  : <div className="flex gap-2">
                    <div onClick={handleProfileSave}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                      儲存
                    </div>
                    <div onClick={handleProfileCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                      取消
                    </div>
                  </div>
                )}
              </div>
            </div>
            {profile?.user_name ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={
                    <span>
                      <span className="text-red-500">*</span> 姓名
                    </span>
                  } value={draft.user_name}
                    onChange={e => setDraft(d => ({ ...d, user_name: e.target.value }))} disabled={!profileEditing} required />
                  <InputField label="英文姓名" value={draft.user_en_name}
                    onChange={e => setDraft(d => ({ ...d, user_en_name: e.target.value }))} disabled={!profileEditing} />
                  <InputField
                    label={
                      <span>
                        <span className="text-red-500">*</span> E-mail
                      </span>
                    }
                    value={draft.email}
                    type="email"
                    readOnly // 🔒 不可改，但可以點擊
                    required
                    className="cursor-not-allowed" // 顯示不可修改手勢
                    onClick={() => {
                      if (profileEditing)
                        Swal.fire({
                          icon: "warning",
                          title: "E-mail不可變更，如需變更請洽系統管理員",
                        })
                    }}
                  />
                  <InputField label={
                    <span>
                      <span className="text-red-500">*</span> 座號
                    </span>
                  } value={draft.seat_number} readOnly
                    onClick={() => {
                      if (profileEditing)
                        Swal.fire({
                          icon: "warning",
                          title: "座號不可變更，如需變更請洽系統管理員",
                        })
                    }}
                    disabled={!profileEditing} required />
                  <InputField label="暱稱" value={draft.user_nick_name}
                    onChange={e => setDraft(d => ({ ...d, nickname: e.target.value }))} disabled={!profileEditing} />
                  <InputField label="個人簡介" value={draft.user_title}
                    onChange={e => setDraft(d => ({ ...d, user_title: e.target.value }))} disabled={!profileEditing} />
                  <SelectField label="開發主力" value={draft.position_id} options={positionList}
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        position_id: Number(e.target.value)
                      }))
                    }
                    disabled={!profileEditing}
                  />
                  <InputField label="電話" value={draft.phone}
                    onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))} disabled={!profileEditing} />


                  <InputField label="GitHub" value={draft.github}
                    onChange={e => setDraft(d => ({ ...d, github: e.target.value }))} disabled={!profileEditing} placeholder="github.com/your-username" />
                  <InputField label="LinkedIn" value={draft.linkedin}
                    onChange={e => setDraft(d => ({ ...d, linkedin: e.target.value }))} disabled={!profileEditing} placeholder="linkedin.com/in/your-name" />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">自我介紹</label>
                  <textarea
                    value={draft.bio}
                    onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                    disabled={!profileEditing}
                    rows={3}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm resize-none transition-all outline-none
                  ${!profileEditing ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-800"}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="text-center text-md text-orange-700 font-medium">
                  ⚠️ 尚未設定使用者座號
                </div>
                <div
                  className="w-full mt-4 text-center text-orange-600
                         font-bold cursor-pointer transition-all duration-200 hover:text-orange-800 hover:underline"
                  onClick={() => askSeatNumber()}
                >
                  前往設定頁面
                </div>

              </>
            )}
          </Card>

          <Card className="p-5 md:p-6">
            <div className="w-full flex mb-2">
              <SectionTitle icon="🛠️" title="技術技能" />
              {/* Edit button */}
              <div className="flex-shrink-0 ml-auto">
                {profile?.user_name && (!skillEditing
                  ? <div onClick={() => setSkillEditing(true)}
                    className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                    ✏️ 編輯
                  </div>
                  : <div className="flex gap-2">
                    <div
                      onClick={handleSkillsSave}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                      儲存
                    </div>
                    <div
                      onClick={handleSkillsCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                      取消
                    </div>
                  </div>
                )}
              </div>
            </div>
            {skillEditing ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillOptions.map(skill => (
                    <div
                      key={skill.id}
                      onClick={() => toggleSkill(Number(skill.id))}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition-all
                          ${draft?.skills.includes(skill.id)
                          ? "bg-red-800 text-white border-red-800"
                          : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-700"}`}
                    >
                      {draft?.skills.includes(skill.id) ? "✓ " : ""}
                      {skill.skill_name}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCustomSkill()}
                    placeholder="自訂技能（Enter 新增）"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                  <div onClick={addCustomSkill}
                    className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors">
                    新增
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillOptions
                  .filter(skill => draft?.skills.includes(skill.id))
                  .map(skill => (
                    <span
                      key={skill.id}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full font-medium"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
              </div>
            )}
          </Card>

          <Card className="p-5 md:p-6">
            <SectionTitle icon="🎓" title="課程資訊" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[["期別", "生成式AI與全端程式設計"], ["加入日期", "2026.01.19"], ["班級角色", "學員"]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-bold text-gray-500">{val}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-5 md:p-6 max-w-3xl">
          <div className='w-full text-center text-red-500 font-bold'>
            本功能需使用者授權
          </div>
          <div className="flex mt-3">
            <div
              className="mx-auto px-3 text-center text-blue-700 font-semibold cursor-pointer rounded-lg py-2 
              transition-all duration-200 hover:text-blue-900 hover:bg-blue-50 hover:shadow-sm active:scale-95"
              onClick={() => setGotoAuthorize(true)}
            >
              前往授權
            </div>

          </div>
        </Card>
      ) : (
        <></>
      )}

      {/* ── 活動紀錄 ─────────────────────────────────────────── */}
      {tab === "activity" && (
        <Card className="p-5 md:p-6 max-w-3xl">
          <SectionTitle icon="📋" title="近期活動" />
          <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
            {activityLog.map((a, i) => (
              <div key={i} className="relative">
                <span className={`absolute -left-[25px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-xs ${activityDot[a.color]}`} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
                    <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap sm:ml-4 pl-6 sm:pl-0">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── 成就徽章 ─────────────────────────────────────────── */}
      {tab === "badges" && (
        <div className="max-w-3xl space-y-5">
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🏆" title="已獲得的成就" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.filter(b => b.earned).map((b, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="font-bold text-gray-800 text-sm">{b.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <SectionTitle icon="🔒" title="尚未解鎖" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.filter(b => !b.earned).map((b, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center opacity-50">
                  <div className="text-3xl mb-2 grayscale">{b.icon}</div>
                  <p className="font-bold text-gray-500 text-sm">{b.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── 帳號設定 ─────────────────────────────────────────── */}
      {tab === "settings" ? isAuthorized ? (
        <div className="max-w-3xl space-y-5">
          {/* 修改密碼 */}
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🔑" title="修改密碼" />
            <div className="space-y-3 max-w-sm">
              <InputField label="目前密碼" type="password" value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="請輸入目前密碼" />
              <InputField label="新密碼" type="password" value={pwForm.next}
                onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="至少 4 個字元" />
              <InputField label="確認新密碼" type="password" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="再次輸入新密碼" />
              <div onClick={handlePwSave}
                className="bg-red-800 hover:bg-red-900 text-center text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors">
                更新密碼
              </div>
            </div>
          </Card>

          {/* 通知設定 */}
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🔔" title="通知偏好" />
            <div className="space-y-3">
              {[
                ["forum", "💬", "知識論壇", "有人回覆你的貼文時通知"],
                ["course", "📢", "課程公告", "新公告發布時通知"],
                ["meeting", "📋", "班務會議", "會議提醒與議程更新"],
                ["career", "💼", "職涯發展", "新職缺或活動推播"],
                ["email", "📧", "Email 通知", "將通知同步寄送至 Email"],
              ].map(([key, icon, label, desc]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                    className={`w-12 h-6 rounded-full transition-all cursor-pointer relative flex-shrink-0
                      ${notifications[key] ? "bg-red-700" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all
                      ${notifications[key] ? "left-6" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 危險操作 */}
          <Card className="p-5 md:p-6 border-red-100">
            <SectionTitle icon="⚠️" title="帳號操作" />
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">登出所有裝置</p>
                  <p className="text-xs text-gray-400 mt-0.5">在所有已登入的裝置中登出</p>
                </div>
                <div
                  onClick={handleLogoutAllDevices}
                  className="bg-gray-700 hover:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  登出所有裝置
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-red-700">停用帳號</p>
                  <p className="text-xs text-red-400 mt-0.5">停用後需聯絡管理員重新啟用</p>
                </div>
                <div onClick={() => deactivateAccount()}
                  className="bg-red-700 hover:bg-red-800 text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto">
                  停用帳號
                </div>
              </div>
            </div>
          </Card>
        </div>) : (
        <Card className="p-5 md:p-6 max-w-3xl">
          <div className='w-full text-center text-red-500 font-bold'>
            本功能需使用者授權
          </div>
          <div className="flex mt-3">
            <div
              className="mx-auto px-3 text-center text-blue-700 font-semibold cursor-pointer rounded-lg py-2 
              transition-all duration-200 hover:text-blue-900 hover:bg-blue-50 hover:shadow-sm active:scale-95"
              onClick={() => setGotoAuthorize(true)}
            >
              前往授權
            </div>

          </div>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}
