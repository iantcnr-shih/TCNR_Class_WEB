import { useState } from "react";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const meetings = [
  {
    title: "第一次班務會議", date: "2026-02-12", status: "已完成", statusColor: "emerald",
    agendas: ["班代/學藝 選舉", "打掃區域分配"],
    results: ["起訖日：2026.03.02~2026.03.27", "班代：陳秉霖", "學藝：王琮毓", "區域已依各組線上填寫分配"],
  },
  { title: "第二次班務會議", date: "未定", status: "待確認", statusColor: "amber",   agendas: ["班代/學藝 選舉", "打掃區域分配"], results: [] },
  { title: "第三次班務會議", date: "未定", status: "待確認", statusColor: "gray",    agendas: ["班代/學藝 選舉", "打掃區域分配"], results: [] },
];

const meetingStatusBadge = { emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700", gray: "bg-gray-100 text-gray-600" };


const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

/* ─── 班務會議 ──────────────────────────────────────────────────────── */
export default function ClassMeeting() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="班務會議" subtitle="議題討論與決策機制，促進團隊共識與執行效能" />

      <div className="max-w-3xl space-y-4">
        {meetings.map((m, i) => (
          <div key={i} className={`bg-white rounded-2xl ${expanded === i ? "shadow-xl" : "shadow-sm"} border border-gray-100 overflow-hidden`}>
            <div
              onClick={() => setExpanded(expanded === i ? -1 : i)}
              className={`w-full flex items-center justify-between p-4 md:p-3 cursor-pointer ${expanded === i ? "bg-[rgb(217,230,241)]" : "bg-gray-50"} hover:bg-gray-200 transition-colors text-left`}
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                  ${m.statusColor === "emerald" ? "bg-emerald-100" : m.statusColor === "amber" ? "bg-amber-100" : "bg-gray-100"}`}>
                  📋
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm md:text-base truncate">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📅 {m.date === "未定" ? <span className="text-amber-500 font-medium">日期待確認</span> : m.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-2">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold hidden sm:inline-block ${meetingStatusBadge[m.statusColor]}`}>{m.status}</span>
                <span className={`text-gray-400 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}>▾</span>
              </div>
            </div>

            {/* Mobile: show status badge inside collapse area */}
            {expanded === i && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-100 pt-4">
                <span className={`sm:hidden inline-block mb-3 text-xs px-2 py-1 rounded-full font-semibold ${meetingStatusBadge[m.statusColor]}`}>{m.status}</span>
                {/* 1 col on mobile, 2 col on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">📌 議程項目</p>
                    {m.agendas.map((a, j) => (
                      <div key={j} className={`flex items-center gap-2 py-2 text-sm text-gray-700 ${j < m.agendas.length - 1 ? "border-b border-gray-100" : ""}`}>
                        <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">✅ 會議結果</p>
                    {m.results.length > 0 ? m.results.map((r, j) => (
                      <div key={j} className={`flex items-center gap-2 py-2 text-sm text-gray-700 ${j < m.results.length - 1 ? "border-b border-gray-100" : ""}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        {r}
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 py-2">尚未有會議記錄</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
