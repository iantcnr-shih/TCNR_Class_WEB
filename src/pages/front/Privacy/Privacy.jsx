
import { useState, useRef, useEffect, forwardRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA — 隱私政策
═══════════════════════════════════════════════════════════════════════ */

const privacySections = [
  {
    id: "collect",
    icon: "📥",
    title: "我們蒐集的資料",
    content: [
      "帳號資料：姓名、電子郵件、電話號碼、個人簡介及大頭照等您主動提供之個人識別資料。",
      "學習紀錄：課程出席、作業繳交、測驗成績、論壇發文、AI 工具使用紀錄及平台互動行為等與學習活動相關之資料。",
      "技術資料：IP 位址、瀏覽器類型、作業系統、裝置識別碼、Cookie、存取時間及頁面瀏覽紀錄等自動蒐集之技術性資料。",
      "付款資料：課程費用之付款紀錄。請注意，完整信用卡資訊由第三方金流服務商處理，本公司不直接儲存您的完整支付資訊。",
    ],
  },
  {
    id: "use",
    icon: "🎯",
    title: "資料使用目的",
    content: [
      "提供與改善服務：處理帳號申請、維護平台功能、個人化學習體驗、發送課程通知及行政聯繫。",
      "學習成效分析：分析學員學習數據以優化課程設計，提供個人化學習建議，並向業師、課程團隊提供班級整體學習報告（以去識別化方式呈現）。",
      "安全與合規：偵測並防範欺詐行為、確保平台安全、遵守法律義務及回應主管機關要求。",
      "行銷推廣：在您同意的前提下，以電子郵件發送課程資訊、活動邀請等行銷內容。您可隨時透過帳號設定或電子郵件中的取消訂閱連結撤回同意。",
    ],
  },
  {
    id: "share",
    icon: "🤝",
    title: "資料分享與揭露",
    content: [
      "本公司不會出售、出租或以任何商業方式提供您的個人資料給第三方。惟下列情況除外：",
      "服務提供商：本公司委託之雲端服務、郵件服務、金流服務等第三方服務商，其僅可在提供服務之必要範圍內存取您的資料，且須受本公司資料保護要求之約束。",
      "法律要求：依法律規定、政府命令或司法程序要求揭露時，本公司將配合提供必要資料，並在法律許可範圍內事先通知您。",
      "業師與助教：為提供學習輔助，您的學習進度資料（含出席率、作業狀況）將提供給課程業師及助教查閱，但不包含您的聯絡資訊。",
    ],
  },
  {
    id: "storage",
    icon: "🗄️",
    title: "資料儲存與安全",
    content: [
      "您的資料儲存於台灣境內經資安認證之雲端伺服器。本公司採用業界標準之加密技術（TLS/SSL）保護資料傳輸，並以 AES-256 加密儲存敏感資訊。",
      "本公司定期進行資安稽核與滲透測試，限制內部人員存取個人資料之範圍，並對所有接觸個人資料之人員進行資安訓練。",
      "資料保存期限：帳號資料於帳號刪除後保留 30 天（以便帳號還原）；學習紀錄依法規要求最長保留 5 年；付款紀錄保留 7 年（稅務目的）。",
      "儘管本公司採取上述措施，網路傳輸本質上無法保證絕對安全。若發生資料外洩事件，本公司將依法於 72 小時內通知主管機關，並於合理期間內通知受影響之使用者。",
    ],
  },
  {
    id: "rights",
    icon: "🔐",
    title: "您的隱私權利",
    content: [
      "依據個人資料保護法，您享有以下權利，可隨時透過帳號設定或聯繫本公司行使：",
      "查詢與閱覽權：您可要求查閱本公司保有之您的個人資料，本公司將於 15 個工作天內提供回覆。",
      "更正與補充權：若您的資料有誤或不完整，您有權要求本公司更正或補充。",
      "停止蒐集、處理或利用權：在特定情況下，您可要求本公司停止蒐集、處理或利用您的個人資料。",
      "刪除權：您可要求刪除您的帳號及相關個人資料，惟依法律或合約義務須保留之資料除外。請注意，刪除請求將導致您無法繼續使用本平台服務。",
    ],
  },
  {
    id: "cookies",
    icon: "🍪",
    title: "Cookie 政策",
    content: [
      "本平台使用 Cookie 及類似追蹤技術以維持登入狀態、記錄偏好設定、分析使用行為及提升使用體驗。",
      "必要性 Cookie：維持平台基本功能運作（如登入狀態、購物車），無法關閉。",
      "分析性 Cookie：用於了解使用者如何與平台互動，協助改善功能。您可透過瀏覽器設定或帳號偏好關閉此類 Cookie，但可能影響部分功能。",
      "您可透過瀏覽器設定管理或刪除 Cookie。惟關閉必要性 Cookie 可能導致本平台無法正常運作。",
    ],
  },
  {
    id: "contact_privacy",
    icon: "📬",
    title: "隱私相關聯繫方式",
    content: [
      "若您對本隱私政策有任何疑問，或欲行使上述隱私權利，請透過以下方式聯繫我們的資料保護負責人：",
      "電子郵件：ian.service.tcnr@gmail.com",
      "郵寄地址：台中市南區國光路250號，AI Platform Co. 資料保護負責人 收",
      "本公司承諾在收到您的請求後 15 個工作天內回覆。本隱私政策最後更新日期：2026 年 01 月 01 日。",
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
   PAGE: 隱私政策
═══════════════════════════════════════════════════════════════════════ */
export default function PrivacyPolicy() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="隱私政策"
        subtitle="說明我們如何蒐集、使用與保護您的個人資料"
        updated="2026-01-01"
      />

      {/* Key points highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🚫", title: "絕不出售資料", desc: "您的個人資料永遠不會被出售給第三方" },
          { icon: "🔒", title: "加密儲存", desc: "所有敏感資料以 AES-256 加密保存" },
          { icon: "✋", title: "您保有控制權", desc: "隨時可查閱、更正或刪除您的資料" },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div>
              <p className="font-bold text-blue-900 text-sm">{item.title}</p>
              <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <DocumentViewer sections={privacySections} accentColor="blue" />

      {/* Footer */}
      <Card className="mt-6 p-5 md:p-6 border-blue-100 bg-blue-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-blue-900 text-sm mb-1">對隱私政策有疑問？</p>
            <p className="text-xs text-blue-600">聯繫我們的資料保護負責人：ian.service.tcnr@gmail.com</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <div className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
              聯繫隱私團隊
            </div>
            <div className="bg-white hover:bg-gray-50 border border-blue-200 text-blue-700 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap">
              下載 PDF
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
