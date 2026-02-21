
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

const contactChannels = [
  {
    icon: "📧",
    title: "Email 信箱",
    value: "ian.service.tcnr@gmail.com",
    desc: "一般問題，1-2 個工作天回覆",
    color: "blue",
    action: "寄送 Email",
  },
  {
    icon: "💬",
    title: "Slack 頻道",
    value: "#help-desk",
    desc: "即時討論，平均 30 分鐘內回應",
    color: "emerald",
    action: "開啟 Slack",
  },
  {
    icon: "📞",
    title: "電話諮詢",
    value: "(04) 5566-6789",
    desc: "週一至週五 09:00–18:00",
    color: "orange",
    action: "撥打電話",
  },
  {
    icon: "📍",
    title: "實體地址",
    value: "台中市南區國光路250號",
    desc: "來訪請事先預約",
    color: "red",
    action: "查看地圖",
  },
];

const staffContacts = [
  {
    name: "Annie 王",
    role: "課程總監",
    emoji: "👩‍🏫",
    email: "annie@aiplatform.tw",
    handle: "@annie",
    resp: "課程規劃、學習問題",
    color: "red",
  },
  {
    name: "Ian Shih",
    role: "班代",
    emoji: "👨‍💻",
    email: "ian.tcnr@gmail.com",
    handle: "@ian",
    resp: "班級事務、行政協調",
    color: "blue",
  },
  {
    name: "Billy Wang",
    role: "學藝",
    emoji: "🎨",
    email: "billy@aiplatform.tw",
    handle: "@billy",
    resp: "活動企劃、知識分享",
    color: "emerald",
  },
  {
    name: "Tako Lin",
    role: "技術助教",
    emoji: "🚀",
    email: "tako@aiplatform.tw",
    handle: "@tako",
    resp: "程式問題、作業批改",
    color: "orange",
  },
];

const faqList = [
  {
    q: "課程作業繳交期限是什麼時候？",
    a: "每週作業須在下次上課前 24 小時內繳交，即週日晚上 11:59 前。遲交需事先告知班代或助教，最多可延遲 48 小時。",
  },
  {
    q: "請假需要如何申請？",
    a: "請假請至少提前 2 小時在 Slack #請假頻道 告知，並說明原因。課程錄影將於上課後 48 小時內上傳至學習平台。",
  },
  {
    q: "如何取得業師 1:1 諮詢？",
    a: "每期學員享有 2 次業師 1:1 諮詢資格，請透過平台的「職涯發展」頁面填寫申請表，行政團隊將在 3 個工作天內安排時間。",
  },
  {
    q: "遇到技術問題該找誰？",
    a: "優先在 Slack #技術討論 頻道發問，讓其他學員也能受益。若問題較為私密或緊急，可直接聯繫技術助教 Tako。",
  },
  {
    q: "課程費用可以申請退費嗎？",
    a: "開課後 7 天內申請可退費 80%，第 8-14 天退費 50%，14 天後恕不退費。如有特殊狀況請聯繫課程總監 Annie。",
  },
  {
    q: "結業後還可以使用平台嗎？",
    a: "結業後享有 6 個月的平台基本存取權限，包含論壇、學習資源與職涯服務。之後可付費升級為校友方案繼續使用。",
  },
];

const colorMap = {
  blue:    { card: "bg-blue-50 border-blue-100",    icon: "bg-blue-100 text-blue-600",    badge: "bg-blue-100 text-blue-700",    ring: "ring-blue-200",    text: "text-blue-700"    },
  emerald: { card: "bg-emerald-50 border-emerald-100", icon: "bg-emerald-100 text-emerald-600", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-200", text: "text-emerald-700" },
  orange:  { card: "bg-orange-50 border-orange-100",  icon: "bg-orange-100 text-orange-600",  badge: "bg-orange-100 text-orange-700",  ring: "ring-orange-200",  text: "text-orange-700"  },
  red:     { card: "bg-red-50 border-red-100",        icon: "bg-red-100 text-red-600",        badge: "bg-red-100 text-red-700",        ring: "ring-red-200",     text: "text-red-700"     },
};

const categories = ["一般問題", "技術協助", "課程內容", "行政事務", "職涯諮詢", "其他"];

/* ═══════════════════════════════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════════════════════════════ */

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
  <h3 className="font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 text-sm md:text-base">
    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{icon}</span>
    {title}
  </h3>
);

function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 whitespace-nowrap">
      ✅ {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 聯繫我們
═══════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  const [tab, setTab] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", category: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const tabs = [
    ["form",    "✉️",  "聯繫表單"],
    ["staff",   "👥",  "聯絡人員"],
    ["faq",     "❓",  "常見問題"],
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "請輸入姓名";
    if (!form.email.trim())    e.email    = "請輸入 Email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email 格式不正確";
    if (!form.category)        e.category = "請選擇問題類別";
    if (!form.subject.trim())  e.subject  = "請輸入主旨";
    if (!form.message.trim())  e.message  = "請輸入問題內容";
    else if (form.message.length < 10) e.message = "內容至少需 10 個字";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", category: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );

  const inputCls = (key) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all
    ${errors[key] ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"}`;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen" style={{ fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" }}>
      {toast && <Toast msg={toast} />}

      <PageHeader title="聯繫我們" subtitle="有任何問題或建議，隨時歡迎與我們聯繫" />

      {/* Contact channel cards — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {contactChannels.map((ch, i) => {
          const c = colorMap[ch.color];
          return (
            <div key={i} className={`rounded-2xl border p-4 md:p-5 ${c.card} hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer group`}>
              <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-xl mb-3`}>
                {ch.icon}
              </div>
              <p className="font-bold text-gray-800 text-sm mb-0.5">{ch.title}</p>
              <p className={`text-xs font-semibold ${c.text} mb-1 break-all`}>{ch.value}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-3 hidden sm:block">{ch.desc}</p>
              <div
                onClick={() => showToast(`已複製 ${ch.value}`)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${c.badge} hover:opacity-80`}>
                {ch.action}
              </div>
            </div>
          );
        })}
      </div>

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

      {/* ── 聯繫表單 ─────────────────────────────────────────── */}
      {tab === "form" && (
        <div className="max-w-2xl">
          {submitted ? (
            /* Success state */
            <Card className="p-8 md:p-10 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
                ✅
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-2">訊息已送出！</h2>
              <p className="text-sm text-gray-500 mb-2">
                感謝你的來信，我們將盡快回覆至
              </p>
              <p className="font-bold text-red-800 mb-6">{form.email}</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 border border-gray-100 space-y-2">
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-12 flex-shrink-0">主旨</span>
                  <span className="font-semibold text-gray-800">{form.subject}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-12 flex-shrink-0">類別</span>
                  <span className="font-semibold text-gray-800">{form.category}</span>
                </div>
              </div>
              <div onClick={handleReset}
                className="bg-red-800 hover:bg-red-900 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer transition-colors text-sm">
                再次送出
              </div>
            </Card>
          ) : (
            <Card className="p-5 md:p-6">
              <SectionTitle icon="✉️" title="送出訊息" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="姓名 *" error={errors.name}>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="你的姓名" className={inputCls("name")} />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com" className={inputCls("email")} />
                  </Field>
                </div>

                <Field label="問題類別 *" error={errors.category}>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className={`${inputCls("category")} bg-white`}>
                    <option value="">請選擇類別</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="主旨 *" error={errors.subject}>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="請簡短描述你的問題" className={inputCls("subject")} />
                </Field>

                <Field label="問題內容 *" error={errors.message}>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="請詳細描述你的問題或建議，讓我們能夠更快速地協助你..."
                    rows={5} className={`${inputCls("message")} resize-none leading-relaxed`} />
                  <p className={`text-xs mt-1 text-right ${form.message.length < 10 && form.message.length > 0 ? "text-red-400" : "text-gray-300"}`}>
                    {form.message.length} 字
                  </p>
                </Field>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <div onClick={handleSubmit}
                    className="bg-red-800 hover:bg-red-900 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition-colors text-sm">
                    📨 送出訊息
                  </div>
                  <div onClick={() => { setForm({ name: "", email: "", category: "", subject: "", message: "" }); setErrors({}); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl cursor-pointer transition-colors text-sm">
                    清除
                  </div>
                </div>

                <p className="text-xs text-gray-300 pt-1">
                  * 標示為必填欄位。我們承諾在 2 個工作天內回覆。
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── 聯絡人員 ─────────────────────────────────────────── */}
      {tab === "staff" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {staffContacts.map((s, i) => {
              const c = colorMap[s.color];
              return (
                <Card key={i} className="p-5 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                  <div className={`w-16 h-16 rounded-2xl ${c.card} ring-4 ${c.ring} flex items-center justify-center text-3xl mx-auto mb-3 border`}>
                    {s.emoji}
                  </div>
                  <p className="font-black text-gray-800 text-base">{s.name}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c.badge} mt-1 inline-block`}>{s.role}</span>
                  <p className="text-xs text-gray-400 mt-2 mb-3 leading-relaxed">{s.resp}</p>
                  <div className="space-y-2">
                    <div onClick={() => showToast(`已複製 ${s.email}`)}
                      className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 rounded-lg cursor-pointer transition-colors border border-gray-100 truncate px-2">
                      📧 {s.email}
                    </div>
                    <div onClick={() => showToast(`已複製 ${s.handle}`)}
                      className={`w-full text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors ${c.badge} hover:opacity-80`}>
                      💬 Slack {s.handle}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Office hours */}
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🕐" title="Office Hours 時段" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="bg-gray-50">
                    {["人員", "週一/三", "週六", "線上諮詢"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["👩‍🏫 Annie", "19:00–22:00", "09:00–12:00", "✅ 預約制"],
                    ["👨‍💻 Ian",   "19:00–22:00", "全天",         "✅ 隨時"],
                    ["🎨 Billy",   "19:00–22:00", "全天",         "✅ 隨時"],
                    ["🚀 Tako",    "19:00–22:00", "09:00–17:00", "✅ 隨時"],
                  ].map(([name, mon, sat, online], i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-800">{name}</td>
                      <td className="px-4 py-3 text-gray-500">{mon}</td>
                      <td className="px-4 py-3 text-gray-500">{sat}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-semibold">{online}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── 常見問題 ─────────────────────────────────────────── */}
      {tab === "faq" && (
        <div className="max-w-3xl space-y-3">
          {faqList.map((item, i) => (
            <Card key={i} className="overflow-hidden">
              <div
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-red-700 font-black text-sm flex-shrink-0 mt-0.5">Q</span>
                  <span className="font-semibold text-gray-800 text-sm leading-snug">{item.q}</span>
                </div>
                <span className={`text-gray-400 transition-transform duration-200 flex-shrink-0 text-lg leading-none ${expandedFaq === i ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </div>
              {expandedFaq === i && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-black text-sm flex-shrink-0 mt-0.5">A</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {/* Still need help */}
          <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-6 text-white text-center mt-6">
            <div className="text-3xl mb-3">🙋</div>
            <p className="font-black text-lg mb-1">還是找不到答案？</p>
            <p className="text-red-200 text-sm mb-4">直接聯繫我們，我們很樂意幫助你</p>
            <div
              onClick={() => setTab("form")}
              className="bg-white text-red-800 font-black text-sm px-6 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 transition-colors">
              ✉️ 送出問題
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
