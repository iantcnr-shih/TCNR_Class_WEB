import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

const initialProfile = {
  name: "Ian Shih",
  nickname: "Ian",
  email: "ian.tcnr@gmail.com",
  phone: "0999-999-999",
  role: "班代",
  cohort: "2026 第一期",
  joinDate: "2026-01-19",
  bio: "全端工程師學員，對 React 和 Node.js 特別有興趣。目標是在結業後加入新創公司。",
  github: "github.com/iantcnr-shih",
  skills: ["PHP Laravel", "React", "Node.js", "JavaScript", "PostgreSQL", "MySQL",],
  avatar: "👨‍💻",
};

const activityLog = [
  { icon: "💬", text: "在知識論壇發表《React Server Components 使用時機》", time: "2 小時前",  color: "blue"    },
  { icon: "✅", text: "完成 Week 5 作業：Hooks 深入實作",                   time: "1 天前",   color: "emerald" },
  { icon: "🏆", text: "積分排行榜第 1 名，連續登入 14 天",                  time: "1 天前",   color: "orange"  },
  { icon: "📋", text: "出席第一次班務會議並完成選舉投票",                    time: "9 天前",   color: "red"     },
  { icon: "🎓", text: "完成課程報到，帳號已啟用",                            time: "33 天前",  color: "gray"    },
];

const badges = [
  { icon: "🔥", label: "連續 14 天",  desc: "每日登入",     earned: true  },
  { icon: "🥇", label: "排行第 1",    desc: "積分榜冠軍",   earned: true  },
  { icon: "💬", label: "活躍貢獻者",  desc: "發文 10 篇+",  earned: true  },
  { icon: "✅", label: "全勤學員",    desc: "出席率 100%",  earned: true  },
  { icon: "🚀", label: "Demo Day",    desc: "展示專案",      earned: false },
  { icon: "🎯", label: "結業認證",    desc: "完成課程",      earned: false },
];

const avatarOptions = ["👨‍💻", "🧑‍💻", "👩‍💻", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🦊", "🐼", "🐸", "🦁", "🐙", "🚀"];

const skillOptions = ["React", "Vue", "Angular", "Node.js", "Express", "TypeScript", "JavaScript", "Python", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git", "Figma", "GraphQL", "Redis"];

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */

const activityDot = {
  blue:    "bg-blue-500",
  emerald: "bg-emerald-500",
  orange:  "bg-orange-500",
  red:     "bg-red-500",
  gray:    "bg-gray-400",
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

const InputField = ({ label, value, onChange, type = "text", placeholder, disabled }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all outline-none
        ${disabled
          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
          : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-800"}`}
    />
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
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(initialProfile);
  const [toast, setToast]     = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    forum:    true,
    course:   true,
    meeting:  false,
    career:   true,
    email:    false,
  });

  const tabs = [
    ["profile",  "👤", "基本資料"],
    ["activity", "📋", "活動紀錄"],
    ["badges",   "🏆", "成就徽章"],
    ["settings", "⚙️",  "帳號設定"],
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    showToast("個人資料已儲存");
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
    setShowAvatarPicker(false);
  };

  const toggleSkill = (skill) => {
    const has = draft.skills.includes(skill);
    setDraft(d => ({ ...d, skills: has ? d.skills.filter(s => s !== skill) : [...d.skills, skill] }));
  };

  const addCustomSkill = () => {
    const s = newSkill.trim();
    if (s && !draft.skills.includes(s)) {
      setDraft(d => ({ ...d, skills: [...d.skills, s] }));
    }
    setNewSkill("");
  };

  const handlePwSave = () => {
    if (!pwForm.current) return showToast("請輸入目前密碼");
    if (pwForm.next.length < 6) return showToast("新密碼至少需 6 個字元");
    if (pwForm.next !== pwForm.confirm) return showToast("新密碼與確認密碼不符");
    setPwForm({ current: "", next: "", confirm: "" });
    showToast("密碼已更新");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen" style={{ fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" }}>
      {toast && <Toast msg={toast} />}

      <PageHeader title="個人資料" subtitle="管理你的帳號資訊、查看學習成就與偏好設定" />

      {/* Profile hero card */}
      <Card className="p-5 md:p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-red-50 ring-4 ring-red-100 flex items-center justify-center text-4xl md:text-5xl cursor-pointer select-none"
              onClick={() => editing && setShowAvatarPicker(p => !p)}>
              {draft.avatar}
            </div>
            {editing && (
              <div onClick={() => setShowAvatarPicker(p => !p)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-800 rounded-full text-white text-xs flex items-center justify-center shadow-md cursor-pointer hover:bg-red-900 transition-colors">
                ✏️
              </div>
            )}
          </div>

          {/* Avatar picker */}
          {showAvatarPicker && editing && (
            <div className="absolute z-20 mt-24 ml-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 grid grid-cols-6 gap-2 w-64">
              {avatarOptions.map(a => (
                <div key={a} onClick={() => { setDraft(d => ({ ...d, avatar: a })); setShowAvatarPicker(false); }}
                  className={`text-2xl p-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer ${draft.avatar === a ? "bg-red-100 ring-2 ring-red-400" : ""}`}>
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
              <p className="text-xl md:text-2xl font-black text-gray-900">{profile.name}</p>
              <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold self-center">{profile.role}</span>
              <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-bold self-center">{profile.cohort}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-md">{profile.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
              {profile.skills.map(s => (
                <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Edit button */}
          <div className="flex-shrink-0">
            {!editing
              ? <div onClick={() => { setDraft(profile); setEditing(true); }}
                  className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                  ✏️ 編輯資料
                </div>
              : <div className="flex gap-2">
                  <div onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                    儲存
                  </div>
                  <div onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                    取消
                  </div>
                </div>
            }
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
      {tab === "profile" && (
        <div className="space-y-5 max-w-3xl">
          <Card className="p-5 md:p-6">
            <SectionTitle icon="👤" title="個人資訊" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="姓名" value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} disabled={!editing} />
              <InputField label="暱稱" value={draft.nickname}
                onChange={e => setDraft(d => ({ ...d, nickname: e.target.value }))} disabled={!editing} />
              <InputField label="Email" value={draft.email} type="email"
                onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} disabled={!editing} />
              <InputField label="電話" value={draft.phone}
                onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))} disabled={!editing} />
              <InputField label="GitHub" value={draft.github}
                onChange={e => setDraft(d => ({ ...d, github: e.target.value }))} disabled={!editing} placeholder="github.com/your-username" />
              <InputField label="LinkedIn" value={draft.linkedin}
                onChange={e => setDraft(d => ({ ...d, linkedin: e.target.value }))} disabled={!editing} placeholder="linkedin.com/in/your-name" />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">自我介紹</label>
              <textarea
                value={draft.bio}
                onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                disabled={!editing}
                rows={3}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm resize-none transition-all outline-none
                  ${!editing ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-800"}`}
              />
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <SectionTitle icon="🛠️" title="技術技能" />
            {editing ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillOptions.map(s => (
                    <div key={s} onClick={() => toggleSkill(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition-all
                        ${draft.skills.includes(s)
                          ? "bg-red-800 text-white border-red-800"
                          : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-700"}`}>
                      {draft.skills.includes(s) ? "✓ " : ""}{s}
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
                {profile.skills.map(s => (
                  <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full font-medium">{s}</span>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 md:p-6">
            <SectionTitle icon="🎓" title="課程資訊" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[["期別", profile.cohort], ["加入日期", profile.joinDate], ["班級角色", profile.role]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-bold text-gray-800">{val}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
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
      {tab === "settings" && (
        <div className="max-w-3xl space-y-5">
          {/* 修改密碼 */}
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🔑" title="修改密碼" />
            <div className="space-y-3 max-w-sm">
              <InputField label="目前密碼" type="password" value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="請輸入目前密碼" />
              <InputField label="新密碼" type="password" value={pwForm.next}
                onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="至少 6 個字元" />
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
                ["forum",   "💬", "知識論壇",  "有人回覆你的貼文時通知"],
                ["course",  "📢", "課程公告",  "新公告發布時通知"],
                ["meeting", "📋", "班務會議",  "會議提醒與議程更新"],
                ["career",  "💼", "職涯發展",  "新職缺或活動推播"],
                ["email",   "📧", "Email 通知","將通知同步寄送至 Email"],
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
                <div onClick={() => showToast("已登出所有裝置")}
                  className="bg-gray-700 hover:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto">
                  登出所有裝置
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-red-700">停用帳號</p>
                  <p className="text-xs text-red-400 mt-0.5">停用後需聯絡管理員重新啟用</p>
                </div>
                <div onClick={() => showToast("請聯絡管理員處理")}
                  className="bg-red-700 hover:bg-red-800 text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto">
                  停用帳號
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
