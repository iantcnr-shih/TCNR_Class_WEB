import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

/* 數據分析 */
const statsCards = [
  { label: "本期學員人數", value: "32", unit: "人", change: "+8%", up: true, icon: "👥", color: "blue" },
  { label: "課程完成率", value: "87", unit: "%", change: "+5%", up: true, icon: "✅", color: "emerald" },
  { label: "平均出席率", value: "93", unit: "%", change: "-2%", up: false, icon: "📅", color: "orange" },
  { label: "論壇發文數", value: "156", unit: "篇", change: "+22%", up: true, icon: "💬", color: "purple" },
];
const weeklyActivity = [
  { week: "Week 1", attendance: 100, homework: 94, forum: 45 },
  { week: "Week 2", attendance: 97,  homework: 88, forum: 62 },
  { week: "Week 3", attendance: 94,  homework: 85, forum: 78 },
  { week: "Week 4", attendance: 90,  homework: 81, forum: 91 },
  { week: "Week 5", attendance: 93,  homework: 87, forum: 85 },
];
const skillDistribution = [
  { skill: "React / Frontend", pct: 78, color: "bg-blue-500" },
  { skill: "Node.js / Backend", pct: 62, color: "bg-emerald-500" },
  { skill: "資料庫設計", pct: 55, color: "bg-orange-500" },
  { skill: "TypeScript", pct: 48, color: "bg-violet-500" },
  { skill: "Docker / DevOps", pct: 35, color: "bg-red-500" },
];
const topStudents = [
  { rank: 1, name: "Ian Chen",   score: 98, badge: "🥇", tasks: 24, streak: 14 },
  { rank: 2, name: "Billy Wang", score: 95, badge: "🥈", tasks: 22, streak: 12 },
  { rank: 3, name: "Tako Lin",   score: 91, badge: "🥉", tasks: 20, streak: 10 },
  { rank: 4, name: "Aria Wu",    score: 88, badge: "4",  tasks: 19, streak: 8  },
  { rank: 5, name: "Max Chen",   score: 85, badge: "5",  tasks: 17, streak: 7  },
];


/* ═══════════════════════════════════════════════════════════════════════
   LOOKUP MAPS & SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════ */

const statCardColor = {
  blue:    { bg: "bg-blue-50",    icon: "bg-blue-100",    text: "text-blue-700"    },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100", text: "text-emerald-700" },
  orange:  { bg: "bg-orange-50",  icon: "bg-orange-100",  text: "text-orange-700"  },
  purple:  { bg: "bg-violet-50",  icon: "bg-violet-100",  text: "text-violet-700"  },
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
   PAGE: 數據分析
═══════════════════════════════════════════════════════════════════════ */
export default function DataAnalysis() {
  const [tab, setTab] = useState("overview");
  const tabs = [["overview", "📊", "總覽"], ["activity", "📈", "學習活躍度"], ["ranking", "🏆", "學員排行"]];

  const maxActivity = Math.max(...weeklyActivity.map(w => w.attendance));

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="數據分析" subtitle="視覺化儀表板，支持數據驅動的決策制定" />

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(([key, icon, label]) => (
          <div key={key} onClick={() => setTab(key)}
            className={`px-4 md:px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 -mb-px cursor-pointer whitespace-nowrap flex-shrink-0 transition-all
              ${tab === key ? "bg-red-50 text-red-800 border-red-700" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
            {icon} {label}
          </div>
        ))}
      </div>

      {/* 總覽 */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((s, i) => {
              const c = statCardColor[s.color];
              return (
                <Card key={i} className={`p-4 md:p-5 ${c.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${c.icon}`}>{s.icon}</span>
                    <span className={`text-xs font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                      {s.up ? "▲" : "▼"} {s.change}
                    </span>
                  </div>
                  <p className={`text-2xl md:text-3xl font-black ${c.text}`}>{s.value}<span className="text-base font-bold ml-0.5">{s.unit}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Skill distribution */}
          <Card className="p-5 md:p-6">
            <SectionTitle icon="🧠" title="技能掌握度分佈" />
            <div className="space-y-4">
              {skillDistribution.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{s.skill}</span>
                    <span className="text-sm font-bold text-gray-500">{s.pct}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div className={`${s.color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 學習活躍度 */}
      {tab === "activity" && (
        <Card className="p-5 md:p-6">
          <SectionTitle icon="📈" title="每週學習活躍度" />

          {/* Bar chart */}
          <div className="flex items-end justify-around gap-2 h-48 mb-4">
            {weeklyActivity.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "160px" }}>
                  <div className="flex-1 bg-blue-400 rounded-t-md transition-all" style={{ height: `${(w.attendance / 100) * 160}px` }} title={`出席率 ${w.attendance}%`} />
                  <div className="flex-1 bg-emerald-400 rounded-t-md transition-all" style={{ height: `${(w.homework / 100) * 160}px` }} title={`作業繳交 ${w.homework}%`} />
                  <div className="flex-1 bg-orange-400 rounded-t-md transition-all" style={{ height: `${(w.forum / 100) * 160}px` }} title={`論壇活躍 ${w.forum}%`} />
                </div>
                <span className="text-xs text-gray-400 font-medium">{w.week}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-5 justify-center flex-wrap">
            {[["bg-blue-400", "出席率"], ["bg-emerald-400", "作業繳交率"], ["bg-orange-400", "論壇活躍度"]].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-3 h-3 rounded-sm ${color}`} />
                {label}
              </div>
            ))}
          </div>

          {/* Data table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="bg-gray-50">
                  {["週次", "出席率", "作業繳交率", "論壇活躍度"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-gray-400 border-b border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeklyActivity.map((w, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-red-700 text-xs">{w.week}</td>
                    <td className="px-4 py-2.5 text-blue-600 font-semibold">{w.attendance}%</td>
                    <td className="px-4 py-2.5 text-emerald-600 font-semibold">{w.homework}%</td>
                    <td className="px-4 py-2.5 text-orange-600 font-semibold">{w.forum}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 學員排行 */}
      {tab === "ranking" && (
        <Card className="p-5 md:p-6">
          <SectionTitle icon="🏆" title="學員積分排行榜" />

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {topStudents.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${i < 3 ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"}`}>
                <span className="text-2xl flex-shrink-0">{i < 3 ? s.badge : `#${s.rank}`}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400">🔥 連續 {s.streak} 天 · ✅ {s.tasks} 任務</p>
                </div>
                <span className="font-black text-red-700 text-lg">{s.score}</span>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {["排名", "學員", "積分", "完成任務", "連續天數"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topStudents.map((s, i) => (
                <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i < 3 ? "bg-amber-50/30" : ""}`}>
                  <td className="px-4 py-3 text-xl">{i < 3 ? s.badge : `#${s.rank}`}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 font-black text-red-700 text-lg">{s.score}</td>
                  <td className="px-4 py-3 text-gray-500">{s.tasks} 項</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500">🔥</span>
                      <span className="font-semibold text-gray-700">{s.streak} 天</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
