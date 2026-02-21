/* ─── DATA ─────────────────────────────────────────────────────────── */
const teamMembers = [
  { name: "Ian",   role: "第一任班代", emoji: "👨‍💻", skills: ["Full-Stack", "PHP Laravel", "React", "Node.js"],  desc: "負責班級統籌，協調各項目開發", color: "red"     },
  { name: "Billy", role: "第二任班代", emoji: "🎨",   skills: ["UI/UX", "Vue", "Python"],          desc: "負責學術活動規劃，推動知識分享", color: "blue"    },
  { name: "Tako",  role: "成員", emoji: "🚀",   skills: ["Backend", "Database", "Docker"],   desc: "後端技術核心，負責系統架構設計", color: "emerald" },
];

const memberColor = {
  red:     { ring: "ring-red-200",     bg: "bg-red-50",     text: "text-red-700",     badge: "bg-red-100 text-red-700"     },
  blue:    { ring: "ring-blue-200",    bg: "bg-blue-50",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-700"    },
  emerald: { ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
};
const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

/* ─── 團隊開發 ──────────────────────────────────────────────────────── */
export default function DevTeam() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="團隊開發" subtitle="建立專業人脈網絡，促進跨界合作交流" />

      {/* 1 col → 2 col → 3 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {teamMembers.map((m, i) => {
          const c = memberColor[m.color];
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${c.bg} ring-4 ${c.ring} flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4`}>
                {m.emoji}
              </div>
              <p className={`text-lg md:text-xl font-black ${c.text} mb-1`}>{m.name}</p>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${c.badge} mb-3 inline-block`}>{m.role}</span>
              <p className="text-sm text-gray-500 mb-4">{m.desc}</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {m.skills.map((s, j) => (
                  <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-semibold">{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table — card list on mobile, table on md+ */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">👥</span>
          團隊總覽
        </h3>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {teamMembers.map((m, i) => {
            const c = memberColor[m.color];
            return (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm">{m.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>{m.role}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{m.skills.join("、")}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0">在線</span>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {["成員", "職責", "主要技術", "狀態"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m, i) => {
              const c = memberColor[m.color];
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{m.emoji}</span>
                      <span className="font-bold text-gray-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.badge}`}>{m.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.skills.join("、")}</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-semibold">在線</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
