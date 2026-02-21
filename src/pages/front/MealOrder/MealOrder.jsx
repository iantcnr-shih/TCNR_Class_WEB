import { useState, useEffect } from "react";
import api from "@/api/axios";
import ReviewSection from "@/components/reviews/ReviewSection";

/* ─── DATA ─────────────────────────────────────────────────────────── */

const lunchOptions = [
  { name: "排骨飯", price: 80, available: true },
  { name: "雞腿飯", price: 90, available: true },
  { name: "素食便當", price: 75, available: true },
  { name: "牛肉麵", price: 100, available: false },
];
const drinkOptions = [
  { name: "紅茶", price: 25 },
  { name: "綠茶", price: 25 },
  { name: "咖啡", price: 45 },
  { name: "豆漿", price: 30 },
];
const storeReviews = [
  { name: "八方雲集", rating: 4.5, comment: "鍋貼很酥脆，湯品大碗好喝" },
  { name: "米撰雞腿壩王", rating: 4.2, comment: "雞腿炸得很酥，鹹香好吃" },
  { name: "五棧燒鵝", rating: 3.8, comment: "港式燒鵝便當為招牌必點" },
];
const mealReviews = [
  { name: "雞腿飯", rating: 4.7, comment: "雞腿夠大塊，飯Q彈" },
  { name: "排骨飯", rating: 4.3, comment: "醬汁入味，推薦" },
  { name: "牛肉麵", rating: 4.0, comment: "湯頭濃郁，牛肉軟嫩" },
];
const orderHistory = [
  { date: "2026-02-19", item: "雞腿飯 + 紅茶", amount: 115, status: "已完成" },
  { date: "2026-02-18", item: "排骨飯 + 綠茶", amount: 105, status: "已完成" },
  { date: "2026-02-17", item: "素食便當 + 豆漿", amount: 105, status: "已完成" },
  { date: "2026-02-14", item: "牛肉麵 + 咖啡", amount: 145, status: "已取消" },
];

/* ─── LOOKUP MAPS ───────────────────────────────────────────────────── */

const statusBadge = {
  已完成: "bg-emerald-100 text-emerald-700",
  進行中: "bg-orange-100 text-orange-700",
  待開始: "bg-gray-100 text-gray-600",
  待確認: "bg-amber-100 text-amber-700",
  已取消: "bg-red-100 text-red-700",
};
/* ─── SHARED COMPONENTS ─────────────────────────────────────────────── */

const Stars = ({ rating }) => (
  <span className="text-amber-400 font-bold text-sm">
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    <span className="text-gray-500 ml-1">{rating}</span>
  </span>
);

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

/* ─── 訂餐管理 ──────────────────────────────────────────────────────── */
export default function MealOrder() {
  const [tab, setTab] = useState("service");
  const [user, setUser] = useState(null);
  const [selectedLunch, setSelectedLunch] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [orderexpanded, setOrderexpanded] = useState(-1);
  const [expanded, setExpanded] = useState(-1);

  const tabs = [["service", "🍱", "訂餐服務"], ["review", "⭐", "餐點評價"], ["history", "📋", "歷史紀錄"]];

  const reviewSections = [
    {
      title: "新增評價",
      icon: "🏪",
      content: (
        <div className="text-sm text-gray-500">
          <ReviewSection shopId={1} />
        </div>
      ),
    },
    {
      title: "店家評價",
      icon: "🏪",
      content: storeReviews.map((r, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
          <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
            <span className="font-bold text-gray-800">{r.name}</span>
            <Stars rating={r.rating} />
          </div>
          <p className="text-sm text-gray-500">{r.comment}</p>
        </div>
      )),
    },
    {
      title: "餐點評價",
      icon: "🍽️",
      content: mealReviews.map((r, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
          <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
            <span className="font-bold text-gray-800">{r.name}</span>
            <Stars rating={r.rating} />
          </div>
          <p className="text-sm text-gray-500">{r.comment}</p>
        </div>
      )),
    },
  ];

  const orderSections = [
    {
      title: "午餐選擇",
      icon: "🍱",
      content: (
        <>
          {lunchOptions.map((item, i) => (
            <div
              key={i}
              onClick={() => item.available && setSelectedLunch(item.name)}
              className={`flex items-center justify-between p-3 rounded-xl mb-2 border-[1.5px] transition-all
              ${!item.available
                  ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                  : selectedLunch === item.name
                    ? "bg-red-50 border-red-600 cursor-pointer"
                    : "border-gray-200 hover:border-red-300 cursor-pointer hover:bg-red-50/30"}`}
            >
              <span className="font-semibold text-sm text-gray-800">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold text-sm">NT${item.price}</span>
                {!item.available && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                    售完
                  </span>
                )}
                {selectedLunch === item.name && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    已選
                  </span>
                )}
              </div>
            </div>
          ))}
        </>
      ),
      is_order: false
    },
    {
      title: "飲料選擇",
      icon: "🧋",
      content: (
        <>
          {drinkOptions.map((item, i) => (
            <div
              key={i}
              onClick={() => setSelectedDrink(item.name)}
              className={`flex items-center justify-between p-3 rounded-xl mb-2 border-[1.5px] cursor-pointer transition-all
              ${selectedDrink === item.name
                  ? "bg-red-50 border-red-600"
                  : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"}`}
            >
              <span className="font-semibold text-sm text-gray-800">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold text-sm">NT${item.price}</span>
                {selectedDrink === item.name && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    已選
                  </span>
                )}
              </div>
            </div>
          ))}
        </>
      ),
      is_order: false
    },
    {
      title: "餐點總攬",
      icon: "📋",
      content: (
        <>
          {lunchOptions.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl mb-2 bg-gray-50 border border-gray-100"
            >
              <span className="font-semibold text-sm text-gray-800">{item.name}</span>
              <span className="text-orange-500 font-bold text-sm">NT${item.price}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "飲料總攬",
      icon: "📋",
      content: (
        <>
          {drinkOptions.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl mb-2 bg-gray-50 border border-gray-100"
            >
              <span className="font-semibold text-sm text-gray-800">{item.name}</span>
              <span className="text-orange-500 font-bold text-sm">NT${item.price}</span>
            </div>
          ))}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/user');
        let user = res.data;
        user.role = "admin";
        setUser(user);
      } catch (error) {
        console.log("user error:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="訂餐管理" subtitle="智能訂餐系統，優化用餐體驗，提升行政效率" />

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
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

      {/* 訂餐服務 — 1 col on mobile, 2 col on md+ */}
      {tab === "service" && (
        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 gap-5">
            {orderSections.map((sec, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all
        ${orderexpanded === i ? "shadow-lg" : "shadow-sm"}`}
              >
                {/* Header */}
                <div
                  onClick={() => setOrderexpanded(orderexpanded === i ? -1 : i)}
                  className={`flex items-center justify-between p-5 cursor-pointer transition-colors
          ${orderexpanded === i ? "bg-red-50" : "bg-white hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      {sec.icon}
                    </span>
                    <span className="font-bold text-gray-800">{sec.title}</span>{sec.is_order === false && <span>(尚未點餐)</span>}
                  </div>

                  <span
                    className={`text-gray-400 transition-transform duration-300
            ${orderexpanded === i ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </div>

                {/* Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden
          ${orderexpanded === i ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-5 pt-4 border-t border-gray-100">
                    {sec.content}

                    {/* 訂單摘要只在前兩個 section 顯示 */}
                    {(i === 0 || i === 1) && (selectedLunch || selectedDrink) && (
                      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-xs text-gray-400 mb-2">訂單摘要</p>
                        {selectedLunch && <p className="text-sm font-semibold">🍱 {selectedLunch}</p>}
                        {selectedDrink && <p className="text-sm font-semibold">🧋 {selectedDrink}</p>}
                        <div className="flex gap-2 mt-3">
                          <button className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2 rounded-lg">
                            確認訂餐
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLunch(null);
                              setSelectedDrink(null);
                            }}
                            className="border border-red-700 text-red-700 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg"
                          >
                            清除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 餐點評價 — 1 col on mobile, 2 col on md+ */}
      {tab === "review" && (
        <div className="grid grid-cols-1 gap-5">
          {reviewSections.map((sec, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all
      ${expanded === i ? "shadow-lg" : "shadow-sm"}
    `}
            >
              {/* Header */}
              <div
                onClick={() => setExpanded(expanded === i ? -1 : i)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors
        ${expanded === i ? "bg-amber-50" : "bg-white hover:bg-gray-50"}
      `}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    {sec.icon}
                  </span>
                  <span className="font-bold text-gray-800">{sec.title}</span>
                </div>

                <span
                  className={`text-gray-400 transition-transform duration-300
          ${expanded === i ? "rotate-180" : ""}
        `}
                >
                  ▾
                </span>
              </div>

              {/* Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden
        ${expanded === i ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}
      `}
              >
                <div className="p-5 pt-4 border-t border-gray-100">
                  {sec.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 歷史紀錄 — card list on mobile, table on md+ */}
      {tab === "history" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">📋</span>
            訂餐紀錄
          </h3>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {orderHistory.map((row, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm text-gray-800">{row.item}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[row.status]}`}>{row.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{row.date}</span>
                  <span className="text-orange-500 font-bold text-sm">NT${row.amount}</span>
                </div>
              </div>
            ))}
          </div>



          {user ? (
            <>
              {/* Desktop table view */}
              <table className="hidden md:table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {["日期", "餐點內容", "金額", "狀態"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{row.date}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{row.item}</td>
                      <td className="px-4 py-3 text-orange-500 font-bold">NT${row.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[row.status]}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div>
              <div>
                尚未登入，請先登入會員後查看相關資料。
              </div>
            </div>
          )}
        </div>
      )
      }
    </div >
  );
}
