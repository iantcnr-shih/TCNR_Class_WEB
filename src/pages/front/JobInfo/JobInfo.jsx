import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

/* 職涯發展 */
const careerJobs = [
    { title: "前端工程師", company: "科技股份有限公司", location: "台北市", type: "全職", salary: "60K-90K", tags: ["React", "TypeScript", "Tailwind"], hot: true },
    { title: "後端工程師", company: "雲端解決方案公司", location: "新竹市", type: "全職", salary: "70K-100K", tags: ["Node.js", "PostgreSQL", "Docker"], hot: true },
    { title: "UI/UX 設計師", company: "創意設計工作室", location: "台中市", type: "全職", salary: "50K-75K", tags: ["Figma", "Prototyping", "User Research"], hot: false },
    { title: "資料科學家", company: "AI 新創公司", location: "台北市", type: "全職", salary: "80K-120K", tags: ["Python", "TensorFlow", "SQL"], hot: true },
    { title: "DevOps 工程師", company: "金融科技公司", location: "台北市", type: "全職", salary: "75K-110K", tags: ["AWS", "Kubernetes", "CI/CD"], hot: false },
    { title: "產品經理", company: "電商平台公司", location: "台北市", type: "全職", salary: "65K-95K", tags: ["Roadmap", "Agile", "Analytics"], hot: false },
];
const careerEvents = [
    { date: "2026-03-05", title: "2026 春季技術職涯博覽會", organizer: "台灣資訊學會", location: "台北世貿一館", spots: 200, registered: 158 },
    { date: "2026-03-18", title: "AI 工程師專場招募說明會", organizer: "OpenAI 台灣辦公室", location: "線上 (Zoom)", spots: 500, registered: 321 },
    { date: "2026-04-02", title: "全端開發工作坊 × 求職媒合", organizer: "ALPHA Camp", location: "台北辦公室", spots: 60, registered: 44 },
];
const careerResources = [
    { icon: "📄", title: "履歷健診服務", desc: "由業界導師一對一審閱，提供改善建議" },
    { icon: "🎤", title: "模擬面試練習", desc: "模擬真實技術面試流程，即時回饋" },
    { icon: "🗺️", title: "職涯路徑圖", desc: "依照目標職位規劃 6-12 個月學習藍圖" },
    { icon: "🤝", title: "業師媒合計畫", desc: "與產業先進一對一 mentorship 配對" },
];

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

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 職涯發展
═══════════════════════════════════════════════════════════════════════ */
export default function JobInfo() {
    const [tab, setTab] = useState("jobs");
    const tabs = [["jobs", "💼", "職缺資訊"], ["events", "📅", "職涯活動"], ["resources", "🛠️", "職涯資源"]];

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <PageHeader title="職涯發展" subtitle="整合產業資源，拓展職業發展機會" />

            {/* Tabs */}
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

            {/* 職缺資訊 */}
            {tab === "jobs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {careerJobs.map((job, i) => (
                        <Card key={i} className="p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="font-bold text-gray-800 text-sm md:text-base">{job.title}</p>
                                        {job.hot && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">🔥 熱門</span>}
                                    </div>
                                    <p className="text-sm text-gray-500">{job.company}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                                <span>📍 {job.location}</span>
                                <span>💼 {job.type}</span>
                                <span className="text-emerald-600 font-semibold">💰 {job.salary}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {job.tags.map((t, j) => (
                                    <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">{t}</span>
                                ))}
                            </div>
                            <button className="w-full bg-red-800 hover:bg-red-900 text-white text-sm font-bold py-2 rounded-xl transition-colors cursor-pointer">
                                查看詳情
                            </button>
                        </Card>
                    ))}
                </div>
            )}

            {/* 職涯活動 */}
            {tab === "events" && (
                <div className="space-y-4 max-w-3xl">
                    {careerEvents.map((ev, i) => (
                        <Card key={i} className="p-5 md:p-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center min-w-[56px] flex-shrink-0">
                                    <p className="text-xs text-red-400 font-semibold">{ev.date.slice(5, 7)}月</p>
                                    <p className="text-2xl font-black text-red-800 leading-none">{ev.date.slice(8)}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 mb-1">{ev.title}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                                        <span>🏢 {ev.organizer}</span>
                                        <span>📍 {ev.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${(ev.registered / ev.spots) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{ev.registered}/{ev.spots} 人</span>
                                    </div>
                                </div>
                                <button className="flex-shrink-0 bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer hidden sm:block">
                                    報名
                                </button>
                            </div>
                            <button className="sm:hidden mt-3 w-full bg-red-800 hover:bg-red-900 text-white text-sm font-bold py-2 rounded-xl transition-colors cursor-pointer">
                                報名活動
                            </button>
                        </Card>
                    ))}
                </div>
            )}

            {/* 職涯資源 */}
            {tab === "resources" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
                    {careerResources.map((r, i) => (
                        <Card key={i} className="p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mb-4">{r.icon}</div>
                            <p className="font-bold text-gray-800 mb-2">{r.title}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                            <button className="mt-4 text-red-700 text-sm font-semibold hover:underline cursor-pointer">了解更多 →</button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
