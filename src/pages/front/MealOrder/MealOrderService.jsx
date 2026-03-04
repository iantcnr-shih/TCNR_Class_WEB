import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/auth/UserProvider";
import { getOrderHistoryMock, getReviewsMock, addReviewMock } from "@/api/reviews.mock";
import api from "@/api/axios";

/* ─── 訂餐管理 ──────────────────────────────────────────────────────── */
export default function MealOrderService() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userIP, setUserIP] = useState("");
  const [orderexpanded, setOrderexpanded] = useState(0);

  const [today, setToday] = useState([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [shopId, setShopId] = useState("");
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [foods, setFoods] = useState([]);
  const [foodId, setFoodId] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityOptions, setQuantityOptions] = useState([]);
  const [orderType, setOrderType] = useState("1");
  const [orderRound, setOrderRound] = useState(1);
  const [defaultOrderRound, setDefaultOrderRound] = useState();

  const [userorders, setUserorders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectorders, setSelectorders] = useState([]);
  const [shopSummary, setShopSummary] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [grandBubbleteaTotal, setGrandBubbleteaTotal] = useState(0);
  const [sortConfig, setSortConfig] = useState(null);
  const [isOrderable, setIsOrderable] = useState(false);
  const [isBubbleTeaOrderable, setIsBubbleTeaOrderable] = useState(false);
  const [chargedSeatNumber, setChargedSeatNumber] = useState("");
  const [bubbleteaOrderURL, setBubbleteaOrderURL] = useState("");
  const [selectBubbleTea, setSelectBubbleTea] = useState("");
  const [bubbleTeaPrice, setBubbleTeaPrice] = useState();
  const [bubbleteaOrders, setBubbleteaOrders] = useState([]);
  const [userbubbleteaorders, setUserobubbletearders] = useState([]);

  const [reviews, setReviews] = useState([]);
  // 給 history tab 顯示（date/item/amount/status）
  const [orderHistory, setOrderHistory] = useState([]);
  const [reviewShopId, setReviewShopId] = useState("");
  const [orderroundlists, setOrderroundlists] = useState([]);

  const checkIsOrderable = async () => {
    try {
      const res = await api.get('/api/getManagerControl');
      if (res.status === 200) {
        const controls = res.data.controls
        let is_orderable = controls.find(item => item.c_title === "isOrderable");
        if (is_orderable) {
          setIsOrderable(is_orderable.c_value === "Y" ? true : false);
          if (is_orderable.c_value === "Y") {
            return true;
          }
        }
        return false;
      }
    } catch (error) {
      console.log("getManagerControl error:", error);
      return false;
    }
  }

  const checkBubbleTeaIsOrderable = async () => {
    try {
      const res = await api.get('/api/getManagerControl');
      if (res.status === 200) {
        const controls = res.data.controls
        let is_BubbleTeaOrderable = controls.find(item => item.c_title === "isBubbleTeaOrderable");
        if (is_BubbleTeaOrderable) {
          setIsBubbleTeaOrderable(is_BubbleTeaOrderable.c_value === "Y" ? true : false);
          if (is_BubbleTeaOrderable.c_value === "Y") {
            return true;
          }
        }
        return false;
      }
    } catch (error) {
      console.log("getManagerControl error:", error);
      return false;
    }
  }

  const checkdefaultshops = async () => {
    try {
      const res = await api.get('/api/getShops');
      if (res.status === 200) {
        return res.data.shops;
      }
    } catch (error) {
      console.log("getManagerControl error:", error);
      return false;
    }
  }

  const handleSendOrder = async () => {
    const is_Orderable = await checkIsOrderable();
    const defaultshops = await checkdefaultshops();
    if (!is_Orderable) return alert("今日已收單，如需訂餐請洽班代")
    if (seatNumber == null || seatNumber === "") return alert("座號不可空白");
    if (!shopId) return alert("請選擇店家");
    if (!categoryId) return alert("請選擇餐點類別");
    if (!foodId) return alert("請選擇餐點");
    if (!defaultshops.some(shop => shop.shop_id == shopId)) {
      alert("今日已更改菜單, 請重新訂購");
      window.location.reload();
      return
    }

    try {
      const res = await api.post('/api/addorder', {
        order_date: today.date,
        order_type: orderType,
        order_round: orderRound,
        seat_number: seatNumber,
        food_id: foodId,
        quantity: quantity,
        user_ip: userIP
      });
      if (res.data.success === true) {
        alert("新增餐點成功");
        location.reload();
      } else if (res.data.message === "order_round_error") {
        alert(`系統變更點餐次數 [第${res.data.orderRound}輪點餐], 請重新點餐`);
        window.location.reload();
      } else {
        alert("新增餐點失敗, 請重新點餐");
        window.location.reload();
      }
    } catch (err) {
      alert("系統忙碌中，新增餐點失敗");
      console.error(err);
    }
  }

  const handleSendBubbleTeaOrder = async () => {
    const is_BubbleTeaOrderable = await checkBubbleTeaIsOrderable();
    if (!is_BubbleTeaOrderable) return alert("今日已收單，如需訂餐請洽班代")
    if (!seatNumber) return alert("座號不可空白");
    if (!selectBubbleTea) return alert("請輸入飲料品項");
    if (!bubbleTeaPrice) return alert("請輸入飲料訂購金額");
    try {
      const res = await api.post('/api/addbubbleteaorder', {
        order_date: today.date,
        seat_number: seatNumber,
        bubbletea_name: selectBubbleTea,
        bubbletea_price: bubbleTeaPrice
      });
      if (res.status === 200) {
        alert("新增餐點成功");
        location.reload();
      } else {
        alert("新增餐點失敗");
      }
    } catch (err) {
      alert("新增餐點失敗");
      console.error(err);
    }
  }

  const handleSort = (key) => {
    let direction = "asc"; // 移除 TypeScript 的類型聲明

    // 如果是同一個 key，則切換排序方向
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    // 更新排序配置
    setSortConfig({ key, direction });

    // 根據 key 進行排序
    const sorted = [...orders].sort((a, b) => {
      let aValue;
      let bValue;

      // 根據不同的 key 決定比較的欄位
      switch (key) {
        case "seatNumber":
          aValue = Number(a.seat_number);
          bValue = Number(b.seat_number);
          break;
        case "shop":
          aValue = a.shop_name;
          bValue = b.shop_name;
          break;
        default:
          aValue = a[key];
          bValue = b[key];
      }

      // 進行升冪或降冪排序
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // 更新訂單列表
    setSelectorders(sorted);
  };

  const orderSections = [
    {
      title: "午餐選擇",
      icon: "🍱",
      content: (
        <>
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-7 mb-6 shadow-sm">
            <div className="text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">今日訂單列表<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span>
              {orderroundlists && orderroundlists.length > 1 && (
                <span>
                  第{" "}
                  <label>
                    <select
                      className="p-2"
                      value={orderRound}
                      onChange={(e) => setOrderRound(e.target.value)}
                    >
                      {orderroundlists.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.option}
                        </option>
                      ))}
                    </select>
                  </label>{" "}
                  輪點餐
                </span>
              )}
            </div>
            {userorders.length === 0 ? (
              <div className="text-center px-10 text-gray-400 text-sm">尚無訂單</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">座號</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">店家</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">餐點</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">數量</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">金額</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">付款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userorders.map(o => (
                      <tr key={o.order_id} className="border-b border-gray-200 hover:bg-[#FFF8F7] transition-colors duration-150">
                        <td className="px-4 py-2 text-[rgb(44,26,26)]"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/10 text-[rgb(139,26,46)] font-bold text-[13px]">{o.seat_number}</span></td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">{o.shop_name}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">{o.food_name} {o.remark}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">{o.quantity}{o.food_id <= 13 ? "顆" : "份"}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">${o.quantity * o.price}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">
                          {o.is_paid === 1 ? (
                            <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] font-medium">
                              ✓ 已付款
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] font-medium">
                              ○ 未付款
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-5 text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">新增訂單<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span></div>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(190px,_1fr))] gap-4">
              {isOrderable ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">店家</label>
                    <select className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border-[1.5px] border-[rgb(240,213,207)] rounded-lg
                  text-[rgb(44,26,26)] text-sm font-bold outline-none transition-all duration-200 focus:border-orange-600
                  focus:shadow-[0_0_0_3px_rgba(224,92,42,0.12)] focus:bg-white appearance-none"
                      value={shopId}
                      // onChange={e => setShopId(e.target.value)}
                      onChange={e => selectshop(e.target.value)}
                    >
                      <option value="">請選擇店家</option>
                      {shops.map(s => <option key={s.shop_id} value={s.shop_id}>{s.shop_name}</option>)}
                    </select>
                  </div>
                  {categories.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">餐點類別</label>
                      <select className=" w-full px-3.5 py-2.5 bg-[#F0F0F0] border-[1.5px] border-[rgb(240,213,207)] rounded-lg
                    text-[rgb(44,26,26)] text-sm font-bold outline-none transition-all duration-200 focus:border-orange-600
                    focus:shadow-[0_0_0_3px_rgba(224,92,42,0.12)] focus:bg-white appearance-none"
                        value={categoryId}
                        // onChange={e => setCategoryId(e.target.value)}
                        onChange={e => selectcategory(e.target.value)}
                      >
                        <option value="">請選擇類別</option>
                        {categories.map(c => <option key={c.menu_category_id} value={c.menu_category_id}>{c.category_name}</option>)}
                      </select>
                    </div>
                  )}
                  {foods.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">餐點</label>
                      <select className=" w-full px-3.5 py-2.5 bg-[#F0F0F0] border-[1.5px] border-[rgb(240,213,207)] rounded-lg
                    text-[rgb(44,26,26)] text-sm font-bold outline-none transition-all duration-200 focus:border-orange-600
                    focus:shadow-[0_0_0_3px_rgba(224,92,42,0.12)] focus:bg-white appearance-none"
                        value={foodId}
                        // onChange={e => setFoodId(e.target.value)}
                        onChange={e => selectfood(e.target.value)}
                      >
                        <option value="">請選擇餐點</option>
                        {foods.map(f => <option key={f.food_id} value={f.food_id}>{f.food_name} ${f.price}</option>)}
                      </select>
                    </div>
                  )}
                  {quantityOptions.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">數量</label>
                      <select className=" w-full px-3.5 py-2.5 bg-[#F0F0F0] border-[1.5px] border-[rgb(240,213,207)] rounded-lg
                    text-[rgb(44,26,26)] text-sm font-bold outline-none transition-all duration-200 focus:border-orange-600
                    focus:shadow-[0_0_0_3px_rgba(224,92,42,0.12)] focus:bg-white appearance-none"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                      >
                        {quantityOptions.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="mx-auto text-md text-[rgb(255,0,0)] font-bold">
                  今日已收單，如需訂餐請洽班代
                </div>
              )}

            </div>
            {isOrderable &&
              <div className="w-full px-3.5 py-3.5 bg-[rgb(139,26,46)] rounded-lg
              text-white font-bold text-[15px] text-center tracking-wider mt-5.5
              shadow-lg cursor-pointer transition duration-200 ease-in-out 
              hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(139,26,46,0.3)] hover:bg-[#a01f35]"
                onClick={handleSendOrder}
              >確認送出訂單</div>
            }
          </div>
        </>
      )
    },
    {
      title: "飲料選擇",
      icon: "🧋",
      content: (
        <>
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-7 mb-6 shadow-sm">
            <div className="text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">今日訂單列表<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span></div>
            {userbubbleteaorders.length === 0 ? (
              <>
                <div className="text-center px-10 text-gray-400 text-sm">尚無訂單</div>
                {isBubbleTeaOrderable &&
                  <div className="w-full flex">
                    <div className="mx-auto px-5.5 py-2.5 bg-[rgb(139,26,46)] rounded-lg
                  text-white font-bold text-[15px] text-center tracking-wider mt-5.5
                  shadow-lg cursor-pointer transition duration-200 ease-in-out 
                  hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(139,26,46,0.3)] hover:bg-[#a01f35]"
                      onClick={() => gotobubleteaorder()}
                    >前往訂餐</div>
                  </div>
                }
              </>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">座號</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">餐點</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">金額</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">付款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userbubbleteaorders.map(o => (
                      <tr key={o.bubbletea_order_id} className="border-b border-gray-200 hover:bg-[#FFF8F7] transition-colors duration-150">
                        <td className="px-4 py-2 text-[rgb(44,26,26)]"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/10 text-[rgb(139,26,46)] font-bold text-[13px]">{o.seat_number}</span></td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">{o.bubbletea_name}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">${o.bubbletea_price}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">
                          {o.is_paid === 1 ? (
                            <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] font-medium">
                              ✓ 已付款
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] font-medium">
                              ○ 未付款
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-5 text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">新增訂單<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span></div>
            <div className="overflow-hidden grid grid-cols-[repeat(auto-fit,_minmax(190px,_1fr))] gap-4">
              {isBubbleTeaOrderable ? (
                <>
                  <div className="overflow-x-auto flex gap-1.5 grid md:grid-cols-2">
                    <div className="flex flex-1 md:pr-5">
                      <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">飲料：</label>
                      <input type="text" className="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-200"
                        onChange={(e) => setSelectBubbleTea(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-1">
                      <label className="text-sm font-medium text-[rgb(122,90,90)] tracking-wide">金額：</label>
                      <input type="number" className="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-200"
                        onChange={(e) => setBubbleTeaPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mx-auto text-md text-[rgb(255,0,0)] font-bold">
                  今日已收單，如需訂餐請洽班代
                </div>
              )}

            </div>
            {isBubbleTeaOrderable &&
              <div className="w-full px-3.5 py-3.5 bg-[rgb(139,26,46)] rounded-lg
              text-white font-bold text-[15px] text-center tracking-wider mt-5.5
              shadow-lg cursor-pointer transition duration-200 ease-in-out 
              hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(139,26,46,0.3)] hover:bg-[#a01f35]"
                onClick={handleSendBubbleTeaOrder}
              >確認送出訂單</div>
            }
          </div>
        </>
      )
    },
    {
      title: "餐點總攬",
      icon: "📋",
      content: (
        <>
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-7 mb-6 shadow-sm">
            <div className="text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">今日訂單列表<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span>
              {orderroundlists && orderroundlists.length > 1 && (
                <span>
                  第{" "}
                  <label>
                    <select
                      className="p-2"
                      value={orderRound}
                      onChange={(e) => setOrderRound(e.target.value)}
                    >
                      {orderroundlists.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.option}
                        </option>
                      ))}
                    </select>
                  </label>{" "}
                  輪點餐
                </span>
              )}
            </div>
            {selectorders.length === 0 ? (
              <div className="text-center p-10 text-gray-400 text-sm">尚無訂單</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 text-center text-sm tracking-widest text-[rgb(139,26,46)] font-semibold 
                        hover:bg-[rgb(139,26,46)] hover:text-white 
                        hover:rounded-full cursor-pointer transition-all duration-200 ease-in-out"
                        onClick={() => handleSort("seatNumber")}
                      >座號</th>
                      <th className="px-4 py-2 text-center text-sm tracking-widest text-[rgb(139,26,46)] font-semibold 
                        hover:bg-[rgb(139,26,46)] hover:text-white 
                        hover:rounded-full cursor-pointer transition-all duration-200 ease-in-out"
                        onClick={() => handleSort("shop")}
                      >店家</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">餐點</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">數量</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">金額</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">付款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectorders.map(o => (
                      <tr key={o.order_id} className="border-b border-gray-200 hover:bg-[#FFF8F7] transition-colors duration-150"
                        onClick={() => userorderssummery(o.seat_number)}
                      >
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/10 text-[rgb(139,26,46)] text-[13px]">{o.seat_number}</span></td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">{o.shop_name}</td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">{o.food_name} {o.remark}</td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">{o.quantity}{o.food_id <= 13 ? "顆" : "份"}</td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">${o.quantity * o.price}</td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">
                          {seatNumber == chargedSeatNumber ? (
                            o.is_paid === 1 ? (
                              <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] hover:opacity-100 cursor-pointer hover:scale-110"
                                onClick={(e) => { e.stopPropagation(); togglePaid(o.order_id, o.is_paid) }}
                              >
                                ✓ 已付款
                                <div className="bg-none border border-current text-inherit px-2 py-0.5 rounded text-[11px] ml-1.5 opacity-75 transition-opacity duration-200 font-sans">取消</div>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] hover:opacity-100 cursor-pointer hover:scale-110"
                                onClick={(e) => { e.stopPropagation(); togglePaid(o.order_id, o.is_paid) }}
                              >
                                ○ 未付款
                                <div className="bg-none border border-current text-inherit px-2 py-0.5 rounded text-[11px] ml-1.5 opacity-75 transition-opacity duration-200 font-sans">付款</div>
                              </span>
                            )
                          ) : (
                            o.is_paid === 1 ? (
                              <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] hover:opacity-100 cursor-pointer">
                                ✓ 已付款
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] hover:opacity-100 cursor-pointer">
                                ○ 未付款
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectorders.length > 0 && (
              <>
                <div className="mt-8 h-[1px] bg-[rgb(100,57,48)]"></div>
                <div className="flex flex-wrap gap-2.5 mt-2 pt-5">
                  {shopSummary.map(({ shop_name, total }) => (
                    <div key={shop_name} className="bg-[rgb(255,240,238)] border border-[rgb(240,217,201)] rounded-lg py-2.5 px-4 text-ms text-[rgb(86,56,56)] font-bold shadow-lg">
                      {shop_name}：<span className="text-[rgb(255,102,0)]">${total}</span>
                    </div>
                  ))}
                  <div className="bg-[rgb(139,26,46)] rounded-lg px-5 py-2.5 text-white text-lg font-bold ml-auto shadow-lg">總計 $
                    {grandTotal}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ),
    },
    {
      title: "飲料總攬",
      icon: "📋",
      content: (
        <>
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-7 mb-6 shadow-sm">
            <div className="text-sm font-extrabold text-[rgb(139,26,46)] mb-3 flex items-center gap-2.5 tracking-wider">今日訂單列表<span className="flex-1 h-px bg-[rgb(240,213,207)]"></span></div>
            {bubbleteaOrders.length === 0 ? (
              <div className="text-center p-10 text-gray-400 text-sm">尚無訂單</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">座號</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">餐點</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">金額</th>
                      <th className="px-4 py-2 text-left text-sm tracking-widest text-[rgb(139,26,46)] font-semibold">付款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bubbleteaOrders.map(o => (
                      <tr key={o.bubbletea_order_id} className="border-b border-gray-200 hover:bg-[#FFF8F7] transition-colors duration-150"
                        onClick={() => userbubbleteaorderssummery(o.seat_number)}
                      >
                        <td className="px-4 py-2 text-[rgb(44,26,26)]"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/10 text-[rgb(139,26,46)] font-bold text-[13px]">{o.seat_number}</span></td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">{o.bubbletea_name}</td>
                        <td className="px-4 py-2 text-[rgb(44,26,26)]">${o.bubbletea_price}</td>
                        <td className="px-4 py-2 font-bold text-[rgb(44,26,26)]">
                          {seatNumber == chargedSeatNumber ? (
                            o.is_paid === 1 ? (
                              <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] hover:opacity-100 cursor-pointer hover:scale-110"
                                onClick={(e) => { e.stopPropagation(); togglebubbleteaPaid(o.bubbletea_order_id, o.is_paid) }}
                              >
                                ✓ 已付款
                                <div className="bg-none border border-current text-inherit px-2 py-0.5 rounded text-[11px] ml-1.5 opacity-75 transition-opacity duration-200 font-sans">取消</div>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] hover:opacity-100 cursor-pointer hover:scale-110"
                                onClick={(e) => { e.stopPropagation(); togglebubbleteaPaid(o.bubbletea_order_id, o.is_paid) }}
                              >
                                ○ 未付款
                                <div className="bg-none border border-current text-inherit px-2 py-0.5 rounded text-[11px] ml-1.5 opacity-75 transition-opacity duration-200 font-sans">付款</div>
                              </span>
                            )
                          ) : (
                            o.is_paid === 1 ? (
                              <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.1)] text-[#16a34a] border border-[rgba(34,197,94,0.25)] px-2.5 py-1 rounded-[20px] text-[12px] hover:opacity-100 cursor-pointer">
                                ✓ 已付款
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 border border-orange-200 py-1 px-2.5 rounded-full text-[12px] hover:opacity-100 cursor-pointer">
                                ○ 未付款
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {bubbleteaOrders.length > 0 && (
              <>
                <div className="mt-8 h-[1px] bg-[rgb(100,57,48)]"></div>
                <div className="flex flex-wrap gap-2.5 mt-2 pt-5">
                  <div className="bg-[rgb(139,26,46)] rounded-lg px-5 py-2.5 text-white text-lg font-bold ml-auto shadow-lg">總計 $
                    {grandBubbleteaTotal}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    const boot = async () => {
      const historyRes = await getOrderHistoryMock();

      if (Array.isArray(historyRes)) {
        setOrderHistory(historyRes);
        setOrderItems([]);
      } else {
        setOrderHistory(historyRes?.history ?? []);
        setOrderItems(historyRes?.orderItems ?? []);
      }

      setReviews([]); // reviews 等選店家再載
    };

    boot();
  }, []);

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
          setUserIP(res.data.user_ip);
        }
      } catch (err) {
        console.error(err);
        setUserIP("未知");
      }
    };
    fetchUserIP();
    const fetchShops = async () => {
      try {
        const res = await api.get('/api/getShops');
        if (res.status === 200) {
          setShops(res.data.shops)
        }
      } catch (error) {
        console.log("getShops error:", error);
      }
    }
    fetchShops();
    const fetchGetOrders = async () => {
      try {
        const res = await api.get('/api/getOrders', {
          params: {
            seat_number: seatNumber || null,
            order_date: today.date || null,
            order_type: orderType,
            order_round: orderRound,
          }
        });
        if (res.status === 200) {
          const orders_list = res.data.orders
          const sortedData = orders_list.sort((a, b) => {
            return Number(a.seat_number) - Number(b.seat_number);
          });
          setOrders(sortedData);
        }
      } catch (error) {
        console.log("getShops error:", error);
      }
    }
    fetchGetOrders()
    const fetchGetBubbleteaorders = async () => {
      try {
        const res = await api.get('/api/getBubbleteaorders', {
          params: {
            seat_number: seatNumber || null,
            order_date: today.date || null,
          }
        });
        if (res.status === 200) {
          const bubbletea_orders_list = res.data.bubbletea_orders
          const sortedData = bubbletea_orders_list.sort((a, b) => {
            return Number(a.seat_number) - Number(b.seat_number);
          });
          setBubbleteaOrders(sortedData);

          let grand_bubbletea_total = 0;    // 全部總額

          bubbletea_orders_list.forEach((element) => {
            const subtotal = Number(element.bubbletea_price);

            // 累加全部
            grand_bubbletea_total += subtotal;
          });

          setGrandBubbleteaTotal(grand_bubbletea_total)
        }
      } catch (error) {
        console.log("getBubbleteaorders error:", error);
      }
    }
    fetchGetBubbleteaorders()
    const fetchManagerControl = async () => {
      try {
        const res = await api.get('/api/getManagerControl');
        if (res.status === 200) {
          const controls = res.data.controls
          let is_orderable = controls.find(item => item.c_title === "isOrderable");
          if (is_orderable) {
            setIsOrderable(is_orderable.c_value === "Y" ? true : false);
          }
          let is_bubbletea_orderable = controls.find(item => item.c_title === "isBubbleTeaOrderable");
          if (is_bubbletea_orderable) {
            setIsBubbleTeaOrderable(is_bubbletea_orderable.c_value === "Y" ? true : false);
          }
          let bubbletea_orderURL = controls.find(item => item.c_title === "bubble_tea_url");
          if (bubbletea_orderURL) {
            setBubbleteaOrderURL(bubbletea_orderURL.c_value);
          }
          let charged_seat_number = controls.find(item => item.c_title === "charged_seat_number");
          if (charged_seat_number) {
            setChargedSeatNumber(charged_seat_number.c_value);
          }
          let order_type = controls.find(item => item.c_title === "order_type");
          if (order_type) {
            setOrderType(order_type.c_value);
          }
          let order_round = controls.find(item => item.c_title === "order_round");
          if (order_round) {
            setOrderRound(Number(order_round.c_value));
            setDefaultOrderRound(Number(order_round.c_value));
          }
        }
      } catch (error) {
        console.log("getManagerControl error:", error);
      }
    }
    fetchManagerControl()
  }, []);

  useEffect(() => {
    if (user?.user?.seat_number) {
      setSeatNumber(user.user.seat_number);
    }
  }, [user]);

  useEffect(() => {
    if (seatNumber !== "" && orders.length > 0) {
      const user_all_order = orders.filter(order => order.seat_number == seatNumber);
      let order_round_lists = Array.from(
        new Set(user_all_order.map(order => order.order_round))
      ).map(order_round => ({
        value: order_round,
        option: order_round
      }));
      if (defaultOrderRound && !order_round_lists.some(item => item.value == defaultOrderRound)) {
        order_round_lists.push({
          value: defaultOrderRound,
          option: defaultOrderRound
        });
      }
      order_round_lists.sort((a, b) => a.value - b.value);
      const user_order = user_all_order.filter(order => order.order_round == orderRound);
      const select_orders = orders.filter(order => order.order_round == orderRound);
      setOrderroundlists(order_round_lists);
      setUserorders(user_order);
      setSelectorders(select_orders);


      let shopTotals = {};   // 分組
      let grand_total = 0;    // 全部總額

      select_orders.forEach((element) => {
        const subtotal = Number(element.quantity) * Number(element.price);

        // 累加全部
        grand_total += subtotal;

        // 如果這家店還沒出現
        if (!shopTotals[element.shop_name]) {
          shopTotals[element.shop_name] = 0;
        }

        // 累加該店
        shopTotals[element.shop_name] += subtotal;
      });

      // 🔥 轉成陣列
      let shopArray = Object.entries(shopTotals).map(([shop, total]) => ({
        shop_name: shop,
        total: total
      }));
      setShopSummary(shopArray);
      setGrandTotal(grand_total);
    }
  }, [seatNumber, orders, orderRound, defaultOrderRound])

  useEffect(() => {
    if (seatNumber !== "" && bubbleteaOrders.length > 0) {
      const user_bubbletea_order = bubbleteaOrders.filter(order => order.seat_number == seatNumber);
      setUserobubbletearders(user_bubbletea_order);
    }
  }, [seatNumber, bubbleteaOrders])

  const selectshop = async (shop_id) => {
    setShopId(shop_id);
    setCategories([]);
    setCategoryId("");
    setFoods([]);
    setFoodId("");
    setQuantity(1);

    try {
      const res = await api.get('/api/getCategories', {
        params: { shop_id }  // 這裡將 shop_id 作為查詢參數
      });
      if (res.status === 200) {
        setCategories(res.data.categories)
      }
    } catch (error) {
      console.log("getCategories error:", error);
    }
  }

  const selectcategory = async (menu_category_id) => {
    setCategoryId(menu_category_id);
    setFoods([]);
    setFoodId("");
    setQuantity(1);
    try {
      const res = await api.get('/api/getFoods', {
        params: { menu_category_id }  // 這裡將 shop_id 作為查詢參數
      });
      if (res.status === 200) {
        setFoods(res.data.foods)
      }
    } catch (error) {
      console.log("getFoods error:", error);
    }
  }

  const selectfood = (food_id) => {
    if (food_id === "") setQuantity(1);
    setFoodId(food_id);
  }

  useEffect(() => {
    if (!foodId) { setQuantityOptions([]); return; }
    const fid = parseInt(foodId);
    let opts = [];
    if (fid === 6 || fid === 12 || fid === 13) {
      for (let i = 1; i <= 7; i++) opts.push({ val: i * 2, label: `${i * 2}顆` });
    } else if (fid < 13) {
      for (let i = 1; i <= 15; i++) opts.push({ val: i, label: `${i}顆` });
    } else {
      opts = [{ val: 1, label: "1份" }];
    }
    setQuantityOptions(opts);
    setQuantity(opts[0]?.val || 1);
    setSelectedFood(foods.find(f => f.food_id === fid) || null);
  }, [foodId]);

  const userorderssummery = (seat_number) => {
    // 根據 order_id 獲取該使用者所有訂單的數據
    const selectedOrder = orders.filter(order => order.seat_number === seat_number);

    let totalAmount = 0;

    selectedOrder.forEach(order => {
      totalAmount += order.quantity * order.price; // 計算每個商品的總金額
    });

    // 或者將結果設置為 state 顯示在 UI 上
    alert(`［座號 ${seat_number}號］,訂餐總金額［${totalAmount}元］`);
  };
  const userbubbleteaorderssummery = (seat_number) => {
    // 根據 order_id 獲取該使用者所有訂單的數據
    const selectedOrder = bubbleteaOrders.filter(order => order.seat_number == seat_number);

    let totalAmount = 0;

    selectedOrder.forEach(order => {
      totalAmount += Number(order.bubbletea_price); // 計算每個商品的總金額
    });

    // 這裡可以設置顯示訂單摘要的邏輯，比如顯示總金額、訂單內容等
    console.log("總金額:", totalAmount);
    // 或者將結果設置為 state 顯示在 UI 上
    alert(`［座號 ${seat_number}號］,訂餐總金額［${totalAmount}元］`);
  };

  const togglePaid = async (order_id, is_paid) => {
    try {
      const newIsPaid = is_paid === 1 ? 0 : 1;
      const res = await api.post('/api/orderpaid', {
        order_id: order_id,
        is_paid: newIsPaid,
      });
      if (res.status === 200) {
        setSelectorders(prev => prev.map(o =>
          o.order_id === order_id ? { ...o, is_paid: is_paid === 1 ? 0 : 1 } : o
        ));
      }
    } catch (error) {
      console.log("togglePaid error:", error);
    }
  }
  const togglebubbleteaPaid = async (bubbletea_order_id, is_paid) => {
    try {
      const newIsPaid = is_paid === 1 ? 0 : 1;
      const res = await api.post('/api/bubbleteaorderpaid', {
        bubbletea_order_id: bubbletea_order_id,
        is_paid: newIsPaid,
      });
      if (res.status === 200) {
        setBubbleteaOrders(prev => prev.map(o =>
          o.bubbletea_order_id === bubbletea_order_id ? { ...o, is_paid: is_paid === 1 ? 0 : 1 } : o
        ));
      }
    } catch (error) {
      console.log("bubbleteaorderpaid error:", error);
    }
  }

  const gotobubleteaorder = async () => {
    const is_Orderable = await checkBubbleTeaIsOrderable();
    if (is_Orderable && bubbleteaOrderURL !== "") {
      window.open(bubbleteaOrderURL, "_blank");
    } else if (!is_Orderable) {
      alert("今日已收單，如需訂餐請洽班代")
    } else {
      alert("飲料揪團尚未開啟，如需訂餐請洽班代")
    }
  }

  return (
    <>
      {/* 訂餐服務 — 1 col on mobile, 2 col on md+ */}
      <div className="grid grid-cols-1 gap-5">
        {orderSections.map((sec, i) => {
          const needSeat =
            sec.title === "午餐選擇" || sec.title === "飲料選擇";

          const canShowContent = !needSeat || seatNumber;

          return (
            <div
              key={i}
              className={`max-w-4xl rounded-2xl border border-gray-100 overflow-hidden transition-all
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
                  <span className="font-bold text-gray-800">{sec.title}</span>
                  {sec.title === "午餐選擇" ? userorders.length < 1 ? <span>(尚未點餐)</span> : <span>(已點餐)</span> : ""}
                  {sec.title === "飲料選擇" ? userbubbleteaorders.length < 1 ? <span>(尚未點餐)</span> : <span>(已點餐)</span> : ""}
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
          ${orderexpanded === i ? "opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="p-5 pt-4 border-t border-gray-100">
                  {canShowContent ? (
                    sec.content
                  ) : (
                    <>
                      <div className="text-center text-md text-orange-500 font-medium">
                        ⚠️ 訂餐前須完成座號設定
                      </div>
                      <div
                        className="w-full mt-4 text-center text-orange-500
                         font-bold cursor-pointer transition-all duration-200 hover:text-orange-800 hover:underline"
                        onClick={() => navigate("/profile")}
                      >
                        前往設定頁面
                      </div>

                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div >
    </>
  );
}
