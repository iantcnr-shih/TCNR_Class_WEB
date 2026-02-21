import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

/* 課程公告 */
const announcements = [
  {
    id: 1, tag: "重要", tagColor: "red", date: "2026-02-20",
    title: "【重要】第一階段結業評量說明",
    content: "結業評量將於 2026-03-14 (六) 舉行，共分筆試與實作兩部分，請各位學員提前準備。筆試範圍涵蓋 React 基礎、Node.js API 設計；實作部分需在 3 小時內完成指定專案。",
    author: "課程辦公室",
  },
  {
    id: 2, tag: "課程", tagColor: "blue", date: "2026-02-18",
    title: "Week 6 課程進度調整通知",
    content: "因應學員學習狀況，Week 6 原訂的 Docker 進階課程將延至 Week 7 進行，Week 6 改為 TypeScript 深入實作。請更新個人學習計畫。",
    author: "Ian（班代）",
  },
  {
    id: 3, tag: "活動", tagColor: "emerald", date: "2026-02-15",
    title: "Demo Day 報名開始！",
    content: "第一期 Demo Day 訂於 2026-04-05 (日)，歡迎各組踴躍報名展示專案。報名截止日為 3/20，每組展示時間 10 分鐘，含 Q&A。",
    author: "Billy（學藝）",
  },
  {
    id: 4, tag: "資源", tagColor: "orange", date: "2026-02-12",
    title: "學習資源平台帳號開通通知",
    content: "所有學員的 Udemy / LeetCode Premium 帳號已開通，請使用課程信箱登入。如有問題請聯繫助教。",
    author: "課程辦公室",
  },
  {
    id: 5, tag: "課程", tagColor: "blue", date: "2026-02-10",
    title: "業師訪談系列 — 3 月場次公告",
    content: "3 月將邀請三位業界導師進行線上分享，主題涵蓋：系統設計面試技巧、新創 vs 大廠職涯選擇、AI 工具在工程師日常的應用。",
    author: "課程辦公室",
  },
];
const schedule = [
  { week: "Week 5", date: "2026-02-23", topic: "React Hooks 深入解析", instructor: "Ian", status: "即將開始" },
  { week: "Week 6", date: "2026-03-02", topic: "TypeScript 實戰應用", instructor: "Billy", status: "未開始" },
  { week: "Week 7", date: "2026-03-09", topic: "Node.js API 設計模式", instructor: "Tako", status: "未開始" },
  { week: "Week 8", date: "2026-03-16", topic: "Docker & 容器化部署", instructor: "Ian", status: "未開始" },
  { week: "Week 4", date: "2026-02-16", topic: "State Management (Redux)", instructor: "Billy", status: "已完成" },
  { week: "Week 3", date: "2026-02-09", topic: "元件設計與複用", instructor: "Ian", status: "已完成" },
];

/* ═══════════════════════════════════════════════════════════════════════
   LOOKUP MAPS & SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════ */

const statusBadge = {
  即將開始: "bg-orange-100 text-orange-700",
  未開始: "bg-gray-100 text-gray-500",
  已完成: "bg-emerald-100 text-emerald-700",
};
const tagColor = {
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-violet-100 text-violet-700",
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
  <h3 className="font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2">
    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm">{icon}</span>
    {title}
  </h3>
);

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 課程公告
═══════════════════════════════════════════════════════════════════════ */
export default function CourseAnnouncement() {
  const [tab, setTab] = useState("announce");
  const [expanded, setExpanded] = useState(null);
  const tabs = [["announce", "📢", "公告列表"], ["schedule", "📆", "課程進度"]];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="課程公告" subtitle="課程資訊、活動通知與學習排程一覽" />

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(([key, icon, label]) => (
          <div
            key={key}
            onClick={() => setTab(key)}
            className={`
              px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold 
              rounded-t-lg transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap flex-shrink-0
              ${tab === key
                ? "bg-red-50 text-red-800 border-red-700 shadow-md transform translate-y-0"
                : "text-gray-400 border-transparent hover:text-gray-600 hover:shadow-sm hover:-translate-y-0.5"}
              active:translate-y-0.5 active:shadow-inner
            `}
          >
            {icon} {label}
          </div>
        ))}
      </div>

      {/* 公告列表 */}
      {tab === "announce" && (
        <div className="space-y-4 max-w-3xl">
          {announcements.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              <div
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="w-full text-left p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 mt-0.5 ${tagColor[a.tagColor]}`}>{a.tag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm md:text-base leading-snug">{a.title}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>📅 {a.date}</span>
                      <span>✍️ {a.author}</span>
                    </div>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded === a.id ? "rotate-180" : ""}`}>▾</span>
                </div>
              </div>
              {expanded === a.id && (
                <div className="px-4 md:px-5 pb-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* 課程進度 */}
      {tab === "schedule" && (
        <Card className="p-5 md:p-6">
          <SectionTitle icon="📆" title="週次課程進度" />

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">{s.week}</span>
                    <p className="font-semibold text-gray-800 text-sm mt-1">{s.topic}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[s.status]}`}>{s.status}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>📅 {s.date}</span>
                  <span>👤 {s.instructor}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {["週次", "日期", "主題", "講師", "狀態"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md">{s.week}</span></td>
                  <td className="px-4 py-3 text-gray-400">{s.date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{s.topic}</td>
                  <td className="px-4 py-3 text-gray-500">{s.instructor}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[s.status]}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
