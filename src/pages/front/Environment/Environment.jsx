import { useState } from "react";
/* ─── DATA ─────────────────────────────────────────────────────────── */
// const cleanPeriods = [
//   { label: "第一期", range: "2026-01-19 ～ 2026-02-26", status: "進行中", color: "emerald", areas: ["外掃A區", "教室B區"] },
//   { label: "第二期", range: "2026-03-02 ～ 2026-03-27", status: "待開始", color: "orange", areas: ["外掃A區", "教室B區"] },
//   { label: "第三期", range: "2026-03-30 ～ 2026-04-28", status: "尚未分配", color: "gray", areas: ["外掃A區", "教室B區"] },
// ];
const cleanPeriods = [
  {
    label: "第一期",
    range: "2026-01-19 ～ 2026-02-26",
    status: "進行中",
    color: "green",
    areas: ["外掃A區", "教室B區"],
    photos: ["/TCNR_Class_WEB/images/1_1.jpg", "/TCNR_Class_WEB/images/1_2.jpg", "/TCNR_Class_WEB/images/1_3.jpg"],
  },
  {
    label: "第二期",
    range: "2026-03-02 ～ 2026-03-27",
    status: "待開始",
    color: "orange",
    areas: ["外掃A區", "教室B區"],
    photos: ["/TCNR_Class_WEB/images/2_1.jpg"],
  },
  {
    label: "第三期",
    range: "2026-03-30 ～ 2026-04-28",
    status: "尚未分配",
    color: "blue",
    areas: ["外掃A區", "教室B區"],
    photos: [],
  },
];

/* ─── LOOKUP MAPS ───────────────────────────────────────────────────── */

const statusBadge = {
  進行中: "bg-green-100 text-green-700",
  待開始: "bg-orange-100 text-orange-700",
  已完成: "bg-gray-100 text-gray-600",
  尚未分配: "bg-blue-100 text-blue-700",
  已取消: "bg-red-100 text-red-700",
};

const periodTopBorder = { green: "border-t-4 border-green-600", orange: "border-t-4 border-orange-500", blue: "border-t-4 border-blue-400" };
const periodDot = { green: "bg-green-600", orange: "bg-orange-500", blue: "bg-blue-400" };
const periodBtn = { green: "bg-green-600 hover:bg-green-700", orange: "bg-orange-500 hover:bg-orange-600", blue: "bg-blue-400 hover:bg-blue-500" };

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

/* ─── 環境管理 ──────────────────────────────────────────────────────── */
export default function Environment() {
  const [visible, setVisible] = useState(false);  // 是否顯示照片區
  const [current, setCurrent] = useState(0);        // 當前照片索引
  const [currentPhotos, setCurrentPhotos] = useState([]); // 當前卡片的照片陣列

  const showPic = (photos, index = 0) => {
    setCurrentPhotos(photos);
    setCurrent(index);
    setVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPic = () => setCurrent((prev) => (prev + 1) % currentPhotos.length);
  const prevPic = () => setCurrent((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="環境管理" subtitle="數位化分配，環境維護流程化管理，責任追蹤" />

      {/* 1 col → 2 col → 3 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {cleanPeriods.map((p, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border ${periodTopBorder[p.color]}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xl font-black text-red-900">{p.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[p.status]}`}>{p.status}</span>
            </div>
            <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
              <span>📅</span> {p.range}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🧹 負責打掃區域</p>
              {p.areas.map((a, j) => (
                <div key={j} className={`flex items-center gap-2 py-2 text-sm text-gray-700 ${j < p.areas.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${periodDot[p.color]}`} />
                  {a}
                </div>
              ))}
            </div>
            <div
              className={`mt-4 w-full text-white text-center text-sm font-bold py-2 rounded-xl transition-colors cursor-pointer ${periodBtn[p.color]}`}
              onClick={() => {
                if (p.photos.length > 0) {
                  showPic(p.photos)
                } else {
                  alert(`［${p.label}］打掃區域尚未分配`);
                }
              }}
            >
              查看詳情
            </div>
          </div>
        ))}
      </div>
      {
        visible && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/70 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative max-w-xl w-full">
              <img
                src={currentPhotos[current]}
                alt={`photo-${current}`}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-lg"
              />
              {/* 關閉按鈕 */}
              <div
                onClick={() => setVisible(false)}
                className="absolute top-2 right-2 text-white bg-gray-800/70 px-2 py-1 rounded hover:bg-gray-900 cursor-pointer"
              >
                X
              </div>
              {/* 左右切換 */}
              {currentPhotos.length > 1 && (
                <>
                  <div
                    onClick={prevPic}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/70 px-2 py-1 rounded hover:bg-gray-900 cursor-pointer"
                  >
                    ◀
                  </div>
                  <div
                    onClick={nextPic}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/70 px-2 py-1 rounded hover:bg-gray-900 cursor-pointer"
                  >
                    ▶
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }

      {/* Timeline — vertical on mobile, horizontal on md+ */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">📊</span>
          打掃期程時間軸
        </h3>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden relative pl-6 border-l-2 border-gray-200 space-y-6">
          {cleanPeriods.map((p, i) => (
            <div key={i} className="relative">
              <span className={`absolute -left-[25px] w-5 h-5 rounded-full border-4 border-white shadow-md ${periodDot[p.color]}`} />
              <p className="font-bold text-sm text-gray-800">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.range}</p>
              <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge[p.status]}`}>{p.status}</span>
            </div>
          ))}
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block relative px-10">
          <div className="absolute top-3 left-16 right-16 h-0.5 bg-gray-200" />
          <div className="flex items-start justify-between relative">
            {cleanPeriods.map((p, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md mb-3 ${periodDot[p.color]}`} />
                <span className="font-bold text-sm text-gray-800 mb-1">{p.label}</span>
                <span className="text-xs text-gray-400 text-center">{p.range}</span>
                <span className={`mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge[p.status]}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}
