
import { useState, useRef, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════════
   DATA — 使用條款
═══════════════════════════════════════════════════════════════════════ */

const termsSections = [
    {
        id: "acceptance",
        icon: "📋",
        title: "條款接受與適用範圍",
        content: [
            "歡迎使用「生成式AI與全端程式設計專業培訓管理平台」（以下簡稱「本平台」）。本使用條款（以下簡稱「本條款」）係由 AI Platform Co.（以下簡稱「本公司」）制定，規範您使用本平台之一切行為。",
            "當您註冊、登入或以任何形式使用本平台，即表示您已詳閱、理解並同意接受本條款及本公司不時發布之隱私政策、課程規範等相關規定。",
            "本條款適用對象包含：正式學員、旁聽學員、業師、課程助教及任何以任何形式存取本平台之使用者。若您不同意本條款任何部分，請立即停止使用本平台。",
        ],
    },
    {
        id: "account",
        icon: "👤",
        title: "帳號申請與使用責任",
        content: [
            "您須年滿 18 歲或在法定監護人同意下方可申請帳號。申請時須提供真實、完整且最新的個人資料，並承諾在資料變更時及時更新。",
            "帳號及密碼為個人專屬，不得轉讓、出售或以任何方式讓他人使用。您對以您帳號進行的一切活動負完全責任，包含您授權或未授權的第三人所進行之行為。",
            "若發現帳號遭到未經授權的使用，請立即通知本公司。本公司保留因安全考量暫停或終止任何帳號之權利，且無須事先通知。",
            "學員於課程結束後 6 個月，帳號將自動轉為校友方案，部分功能存取將受到限制。如需繼續使用完整功能，須升級至付費校友方案。",
        ],
    },
    {
        id: "usage",
        icon: "✅",
        title: "平台使用規範",
        content: [
            "您同意以合法、正當之目的使用本平台，不得從事任何可能損害本公司、其他使用者或第三方之行為。",
            "禁止行為包含但不限於：散布違法或有害內容、冒充他人身份、蓄意干擾平台運作、未經授權存取他人帳號、使用自動化程式大量爬取平台資料。",
            "使用者於知識論壇、討論區等公開場所發表之內容，須符合社群規範，不得包含：仇恨言論、人身攻擊、色情或暴力內容、商業廣告推廣、未經驗證之謠言或不實資訊。",
            "本公司保留移除任何違規內容並對違規帳號採取相應措施之權利，情節嚴重者將永久停權並依法追究相關責任。",
        ],
    },
    {
        id: "intellectual",
        icon: "©️",
        title: "智慧財產權",
        content: [
            "本平台所有課程內容、教材、影片、程式碼範例、設計元素及其他相關素材之著作權，均屬本公司或其授權人所有，受中華民國著作權法及國際著作權公約保護。",
            "學員可在個人學習目的範圍內使用上述材料，但不得複製、散布、改作、公開展示、出售或以任何商業方式利用，亦不得提供給課程以外之第三人。",
            "使用者於本平台發表之原創內容（如論壇文章、心得分享），其著作權仍歸使用者所有，但使用者授予本公司非專屬、免授權金之使用權，得用於平台展示、課程改善及行銷推廣用途。",
        ],
    },
    {
        id: "payment",
        icon: "💳",
        title: "費用、付款與退費",
        content: [
            "課程費用依官方公告之價格為準，本公司保留調整價格之權利，但不影響已完成報名之學員。所有費用均以新台幣（NTD）計價，含 5% 營業稅。",
            "退費政策：開課後 7 日內申請退費，退還已繳費用之 80%；開課後第 8 至 14 日申請，退還 50%；開課滿 14 日後恕不退費。所有退費申請須以書面方式向本公司提出。",
            "因不可抗力因素（包含但不限於天災、疫情、政府命令等）導致課程中斷時，本公司將依實際情況提供課程延期、線上補課或比例退費等方案。",
        ],
    },
    {
        id: "disclaimer",
        icon: "⚠️",
        title: "免責聲明與責任限制",
        content: [
            "本平台依「現狀」提供服務，本公司不保證平台不中斷、無錯誤或完全安全。對於因使用本平台所生之任何直接、間接、附帶或懲罰性損失，本公司之賠償責任以您支付之課程費用為上限。",
            "知識論壇及 AI 應用功能所產生之內容係由使用者或 AI 系統生成，本公司不對其正確性、完整性或適用性負責。使用者應自行判斷並承擔依據該等內容採取行動之風險。",
            "本公司對第三方連結之網站或服務不負任何責任，使用者存取該等外部連結時應自行評估風險。",
        ],
    },
    {
        id: "modification",
        icon: "🔄",
        title: "條款修改與終止",
        content: [
            "本公司保留隨時修改本條款之權利。條款修改後，本公司將於平台顯著位置公告，並以電子郵件通知已註冊學員。修改後條款自公告日起 7 日後生效。",
            "若您於條款修改生效後繼續使用本平台，視為您已同意修改後之條款。若您不同意修改後之條款，請於生效前停止使用本平台並申請退費（如符合退費條件）。",
            "本條款受中華民國法律規範。因本條款所生之爭議，雙方同意以台灣台北地方法院為第一審管轄法院。",
        ],
    },
];

/* ═══════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════════ */

const PageHeader = ({ title, subtitle, updated }) => (
    <div className="mb-6 md:mb-8">
        <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
        <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
        <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">最後更新：{updated}</span>
        </div>
    </div>
);

const Card = forwardRef(({ children, className = "" }, ref) => (
    <div
        ref={ref}
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}
    >
        {children}
    </div>
));

Card.displayName = "Card";
/* ═══════════════════════════════════════════════════════════════════════
   DOCUMENT VIEWER (reused for both pages)
═══════════════════════════════════════════════════════════════════════ */

function DocumentViewer({ sections, accentColor = "red" }) {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const sectionRefs = useRef({});

    const scrollTo = (id) => {
        setActiveSection(id);
        sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Accent color classes
    const accent = {
        red: {
            dot: "bg-red-700",
            active: "bg-red-50 text-red-800 border-red-200 font-bold",
            idle: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            icon: "bg-red-100",
            border: "border-red-200",
            num: "bg-red-800 text-white",
        },
        blue: {
            dot: "bg-blue-600",
            active: "bg-blue-50 text-blue-800 border-blue-200 font-bold",
            idle: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            icon: "bg-blue-100",
            border: "border-blue-200",
            num: "bg-blue-700 text-white",
        },
    }[accentColor];

    return (
        <div className="flex gap-6 items-start">

            {/* ── Sidebar TOC (hidden on mobile) ── */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-4">
                <Card className="p-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">目錄</p>
                    <nav className="space-y-1">
                        {sections.map((s, i) => (
                            <div
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-2
                  ${activeSection === s.id ? accent.active : `border-transparent ${accent.idle}`}`}
                            >
                                <span className="text-sm flex-shrink-0">{s.icon}</span>
                                <span className="leading-snug">{s.title}</span>
                            </div>
                        ))}
                    </nav>
                </Card>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 space-y-5">

                {/* Mobile TOC dropdown */}
                <Card className="p-4 lg:hidden">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">快速跳轉</p>
                    <div className="flex flex-wrap gap-2">
                        {sections.map((s, i) => (
                            <div key={s.id} onClick={() => scrollTo(s.id)}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all
                  ${activeSection === s.id ? accent.active : `border-gray-100 text-gray-500 hover:border-gray-200 bg-gray-50`}`}>
                                {s.icon} {s.title}
                            </div>
                        ))}
                    </div>
                </Card>

                {sections.map((s, i) => (
                    <Card
                        key={s.id}
                        ref={(el) => (sectionRefs.current[s.id] = el)}
                        className="p-5 md:p-6 scroll-mt-24"
                    >
                        {/* Section header */}
                        <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className={`w-10 h-10 rounded-xl ${accent.icon} flex items-center justify-center text-lg flex-shrink-0`}>
                                {s.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${accent.num}`}>
                                        {i + 1}
                                    </span>
                                    <h2 className="font-black text-gray-800 text-base md:text-lg leading-snug">{s.title}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Paragraphs */}
                        <div className="space-y-3">
                            {s.content.map((para, j) => (
                                <div key={j} className="flex gap-3">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${accent.dot}`} />
                                    <p className="text-sm text-gray-600 leading-relaxed">{para}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 使用條款
═══════════════════════════════════════════════════════════════════════ */
export default function TermsOfService() {
    const navigate = useNavigate();
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <PageHeader
                title="使用條款"
                subtitle="請詳細閱讀以下條款，使用本平台即表示您同意遵守"
                updated="2026-01-01"
            />

            {/* Alert banner */}
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>重要提醒：</strong>本條款構成您與本公司之間具有法律約束力的協議。
                    建議您完整閱讀後再使用本平台。如有疑問，請<span className="underline font-bold cursor-pointer"
                        onClick={() => {
                            navigate("/contact");
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}

                    >聯繫我們</span>。
                </p>
            </div>

            <DocumentViewer sections={termsSections} accentColor="red" />

            {/* Footer agreement */}
            <Card className="mt-6 p-5 md:p-6 border-red-100 bg-red-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <p className="font-bold text-red-900 text-sm mb-1">繼續使用本平台即表示您同意上述所有條款</p>
                        <p className="text-xs text-red-600">如有任何疑問，請於使用前<span className="underline font-bold cursor-pointer"
                            onClick={() => {
                                navigate("/contact");
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }}

                        >聯繫我們</span>。</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <div className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                            我已閱讀並同意
                        </div>
                        <div className="bg-white hover:bg-gray-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                            下載 PDF
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
