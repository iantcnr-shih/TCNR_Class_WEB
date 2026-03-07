import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/auth/UserProvider";
import MealOrderService from "@/pages/front/MealOrder/MealOrderService";
import { getOrderHistoryMock, getReviewsMock, addReviewMock } from "@/api/reviews.mock";
import api from "@/api/axios";
import ReviewTab from "./tabs/ReviewTab";

/* ─── LOOKUP MAPS ───────────────────────────────────────────────────── */

const statusBadge = {
  已完成: "bg-blue-100 text-blue-700",
  已付款: "bg-emerald-100 text-emerald-700",
  未付款: "bg-orange-100 text-orange-700",
  未完成: "bg-gray-200 text-gray-600",
  已取消: "bg-red-100 text-red-700",
};

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────── */
const PageHeader = ({ title, subtitle }) => (
  <div className="mb-4 md:mb-6">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

/* ─── 訂餐管理 ──────────────────────────────────────────────────────── */
export default function MealOrder() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("service");
  const { user, setUser } = useUser();

  const [today, setToday] = useState([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [userHistoryOrders, setUserHistoryOrders] = useState([]);
  const [userHistoryBubbleteaOrders, setUserHistoryBubbleteaOrders] = useState([]);
  const [orderMode, setOrderMode] = useState("lunch");

  const [reviews, setReviews] = useState([]);
  // 給 history tab 顯示（date/item/amount/status）
  // 給評論功能推導可選店家/餐點（shop_id/food_id/shop_name/food_name）
  const [reviewShopId, setReviewShopId] = useState("");

  const tabs = [["service", "🍱", "訂餐服務"], ["review", "⭐", "餐點評價"], ["history", "📋", "歷史紀錄"]];

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!reviewShopId) {
        setReviews([]);
        return;
      }

      setReviews([]); // 先清掉舊店家的評論，避免殘影
      try {
        const rs = await getReviewsMock({ shop_id: Number(reviewShopId) });
        if (!ignore) setReviews(rs);
      } catch (e) {
        console.error(e);
        if (!ignore) setReviews([]);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [reviewShopId]);

  useEffect(() => {
    const fetchUserIP = async () => {
      try {
        const res = await api.get("/api/getUserIP");
        if (res.status === 200) {
          if (Array.isArray(today) && today.length === 0) {
            setToday(res.data.today);  // 設置今天的日期與星期
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserIP();
  }, []);

  const fetchGetUserHistoryOrders = async () => {
    try {
      const res = await api.get('/api/getUserHistoryOrders', {
        params: {
          user_id: user?.user?.user_id || null,
        }
      });
      if (res.status === 200) {
        setUserHistoryOrders(res.data.user_orders);
      }
    } catch (error) {
      console.log("getUserHistoryOrders error:", error);
    }
  }

  const fetchGetUserHistoryBubbleteaOrders = async () => {
    try {
      const res = await api.get('/api/getUserHistoryBubbleteaOrders', {
        params: {
          user_id: user?.user?.user_id || null,
        }
      });
      if (res.status === 200) {
        setUserHistoryBubbleteaOrders(res.data.user_orders);
      }
    } catch (error) {
      console.log("getUserHistoryBubbleteaOrders error:", error);
    }
  }
  useEffect(() => {
    fetchGetUserHistoryOrders();
    fetchGetUserHistoryBubbleteaOrders();
    if (user && user?.user?.seat_number) {
      setSeatNumber(user.user.seat_number)
    }
  }, [user])

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="訂餐管理" subtitle="智能訂餐系統，優化用餐體驗，提升行政效率" />
      <div className="
        inline-block
        bg-[rgb(255,239,234)]
        border
        border-[rgba(224,92,42,0.25)]
        text-[rgb(84,39,24)]
        text-xs
        px-[14px]
        py-1
        rounded-full
        font-medium
      ">📅 {today.date}　{today.day}</div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-1 mt-3 mb-6 border-b border-gray-200">
        {tabs.map(([key, icon, label]) => (
          <div
            key={key}
            onClick={() => { setTab(key); if (key === "history") fetchGetUserHistoryOrders() }}
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
      {tab === "service" ? user?.auth ? (
        <MealOrderService />
      ) : (
        <div className="max-w-4xl bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 transition-shadow">
          <div className='w-full text-center text-red-500 font-bold'>
            本功能需使用權限，請洽系統管理員
          </div>
          <div
            className="w-full mt-4 text-center text-blue-500 font-bold cursor-pointer transition-all duration-200 hover:text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            前往登入頁面
          </div>
        </div>
      ) : (<></>)}

      {/* 餐點評價 — 1 col on mobile, 2 col on md+ */}
      {
        tab === "review" && (
          <div className="max-w-6xl">
            <ReviewTab seatNumber={seatNumber ? String(seatNumber) : null} />
          </div>
        )
      }

      {/* 歷史紀錄 — card list on mobile, table on md+ */}
      {tab === "history" && (
        <>
          {user ? (
            <>
              <div className="max-w-3xl bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
                {/* 標題 + 開關按鈕 */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">📋</span>
                    訂餐紀錄
                  </h3>
                  <div className="flex gap-2">
                    <div
                      onClick={() => setOrderMode("lunch")}
                      className={`px-3 py-1 rounded-full font-semibold ${orderMode === "lunch" ? "bg-[rgb(255,229,230)] text-green-800" : "bg-gray-100 text-gray-500"}`}
                    >
                      午餐
                    </div>
                    <div
                      onClick={() => setOrderMode("bubbletea")}
                      className={`px-3 py-1 rounded-full font-semibold ${orderMode === "bubbletea" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                    >
                      手搖飲
                    </div>
                  </div>
                </div>

                {orderMode === "lunch" &&
                  <>
                    {/* Desktop table view */}
                    <table table className="hidden md:table w-full text-sm">
                      <thead>
                        <tr className="bg-[rgb(255,229,230)]">
                          {["日期", "店家", "餐點內容", "金額", "狀態"].map(h => (
                            <th key={h} className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {userHistoryOrders.map((row, i) => {
                          const todayStr = today.date;
                          let badgeText = "";

                          if (row.delete_flag === 1) {
                            badgeText = "已取消";
                          } else if (row.order_date?.slice(0, 10) === todayStr) {
                            badgeText = row.is_paid === 1 ? "已付款" : "未付款";
                          } else {
                            badgeText = row.is_paid === 1 ? "已完成" : "未完成";
                          }

                          return (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-center text-gray-400">{row.order_date}</td>
                              <td className="px-4 py-3 text-center font-semibold text-gray-700">{row.shop_name}</td>
                              <td className="px-4 py-3 text-center font-semibold text-[rgb(184,79,79)]">{row.food_name}</td>
                              <td className="px-4 py-3 text-center text-orange-500 font-bold">
                                NT${row.price * row.quantity}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`text-xs px-3 py-2 rounded-full font-semibold ${statusBadge[badgeText]
                                    }`}
                                >
                                  {badgeText}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Mobile card view */}
                    <div className="md:hidden space-y-3">
                      {userHistoryOrders.map((row, i) => {
                        const todayStr = today.date;
                        let badgeText = "";

                        if (row.delete_flag === 1) {
                          badgeText = "已取消";
                        } else if (row.order_date?.slice(0, 10) === todayStr) {
                          badgeText = row.is_paid === 1 ? "已付款" : "未付款";
                        } else {
                          badgeText = row.is_paid === 1 ? "已完成" : "未完成";
                        }

                        return (
                          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-sm text-[rgb(61,68,73)]">{row.shop_name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[badgeText]}`}>{badgeText}</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold pl-2 text-sm text-[rgb(184,79,79)]">{row.food_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{row.order_date}</span>
                              <span className="text-orange-500 font-bold text-sm">NT${row.price * row.quantity}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                }
                {orderMode === "bubbletea" &&
                  <>
                    {/* Desktop table view */}
                    <table className="hidden md:table w-full text-sm">
                      <thead>
                        <tr className="bg-green-100">
                          {["日期", "餐點內容", "金額", "狀態"].map(h => (
                            <th key={h} className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {userHistoryBubbleteaOrders.map((row, i) => {
                          const todayStr = today.date;
                          let badgeText = "";

                          if (row.delete_flag === 1) {
                            badgeText = "已取消";
                          } else if (row.order_date?.slice(0, 10) === todayStr) {
                            badgeText = row.is_paid === 1 ? "已付款" : "未付款";
                          } else {
                            badgeText = row.is_paid === 1 ? "已完成" : "未完成";
                          }

                          return (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-center text-gray-400">{row.order_date}</td>
                              <td className="px-4 py-3 text-center font-semibold text-[rgb(184,79,79)]">{row.bubbletea_name}</td>
                              <td className="px-4 py-3 text-center text-orange-500 font-bold">
                                NT${row.bubbletea_price}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`text-xs px-3 py-2 rounded-full font-semibold ${statusBadge[badgeText]
                                    }`}
                                >
                                  {badgeText}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Mobile card view */}
                    <div className="md:hidden space-y-3">
                      {userHistoryBubbleteaOrders.map((row, i) => {
                        const todayStr = today.date;
                        let badgeText = "";

                        if (row.delete_flag === 1) {
                          badgeText = "已取消";
                        } else if (row.order_date?.slice(0, 10) === todayStr) {
                          badgeText = row.is_paid === 1 ? "已付款" : "未付款";
                        } else {
                          badgeText = row.is_paid === 1 ? "已完成" : "未完成";
                        }

                        return (
                          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold pl-2 text-sm text-[rgb(184,79,79)]">{row.bubbletea_name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[badgeText]}`}>{badgeText}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{row.order_date}</span>
                              <span className="text-orange-500 font-bold text-sm">NT${row.bubbletea_price}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                }
              </div>
            </>
          ) : (
            <div className="max-w-4xl bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 transition-shadow">
              <div className='w-full text-center text-red-500 font-bold'>
                本功能需使用權限，請洽系統管理員
              </div>
              <div
                className="w-full mt-4 text-center text-blue-500 font-bold cursor-pointer transition-all duration-200 hover:text-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                前往登入頁面
              </div>
            </div>
          )}
        </>
      )
      }
    </div >
  );
}
