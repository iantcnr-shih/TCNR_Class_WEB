import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAdminUser } from "@/components/admin/AdminUserProvider";
import RestaurantManager from "@/pages/admin/AdminMealOrder/RestaurantManager";
import { Newspaper, Utensils, Sparkles, Calendar, MessageSquare, BarChart3, Brain, Users, Menu, X, Bell, Search, User, Settings, ChevronRight, ChevronLeft, TrendingUp, Clock, CheckCircle, ClipboardList, SlidersHorizontal, ShoppingCart, Pen, Trash2, Store, Check } from 'lucide-react';
import Swal from "sweetalert2";
import api from "@/api/axios";

const PAGE_SIZE = 15;

/* ─── Modal ─────────────────────────────────────────────────────── */
function Modal({ title, onClose, onConfirm, confirmLabel = "儲存", confirmColor = "bg-blue-500 hover:bg-blue-600", children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(15,15,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "modalIn .18s cubic-bezier(.4,0,.2,1)" }}
        onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <div onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </div>
        </div>
        {/* body */}
        <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
        {/* footer */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">取消</div>
          <div onClick={onConfirm} className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 ${confirmColor}`}>
            {/* <div className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5`}> */}
            <Check className="w-4 h-4" />
            {confirmLabel}
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(-16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

/* ─── Delete Confirm Modal ──────────────────────────────────────── */
function DeleteModal({ date, name, onClose, onConfirm }) {
  return (
    <Modal title="確認刪除" onClose={onClose} onConfirm={onConfirm}
      confirmLabel="刪除" confirmColor="bg-red-500 hover:bg-red-600">
      <p className="text-sm text-gray-600">確定要刪除 <span className="font-bold text-slate-900">「{date}」訂購的「{name}」</span> 嗎？此操作無法復原。</p>
    </Modal>
  );
}

/* ─── Field ─────────────────────────────────────────────────────── */
function Field({ label, required = false, children }) {
  const tag = children?.type;
  const shouldInject = typeof tag === "string" && ["input", "select", "textarea"].includes(tag);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {required && <span className="text-red-500">*</span>}
        {label}
      </label>
      {shouldInject ? React.cloneElement(children, { required }) : children}
    </div>
  );
}

/* ─── CalendarPicker ─────────────────────────────────────────────── */
function CalendarPicker({ orderMode, value, onChange, availableDates = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initial = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const availableSet = new Set(availableDates);
  const pad = (n) => String(n).padStart(2, "0");
  const toStr = (d) => `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
  const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
  const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${value
          ? `${orderMode === "dish" ? "bg-orange-500 text-white border-amber-600" : "bg-green-600 border border-green-400 text-white"} shadow-sm`
          : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700"
          }`}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>{value || "日期"}</span>
        {value
          ? <span onMouseDown={e => { e.stopPropagation(); onChange(""); }} className="ml-0.5 opacity-80 hover:opacity-100 cursor-pointer"><X className="w-3 h-3" /></span>
          : <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        }
      </div>
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-72"
          style={{ animation: "calPop 0.15s cubic-bezier(.34,1.56,.64,1) both" }}>
          <style>{`@keyframes calPop{from{opacity:0;transform:translateY(-6px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
          <div className="flex items-center justify-between mb-3">
            <div onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 text-slate-400 transition-colors"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-sm font-bold text-slate-800">{viewYear} 年 {MONTHS[viewMonth]}</span>
            <div onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 text-slate-400 transition-colors"><ChevronRight className="w-4 h-4" /></div>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={w} className={`text-center text-[10px] font-semibold py-1 ${i === 0 ? "text-rose-400" : i === 6 ? "text-blue-400" : "text-slate-400"}`}>{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, idx) => {
              if (!day) return <div key={`e${idx}`} />;
              const dateStr = toStr(day);
              const isSelected = dateStr === value;
              const hasData = availableSet.size === 0 || availableSet.has(dateStr);
              const isSun = (firstDay + day - 1) % 7 === 0;
              const isSat = (firstDay + day - 1) % 7 === 6;
              return (
                <div key={day} disabled={!hasData} onClick={() => { onChange(dateStr); setOpen(false); }}
                  className={`relative mx-auto w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all duration-100
                    ${isSelected ? "bg-amber-500 text-white shadow-md scale-110"
                      : hasData ? `${orderMode === "dish" ? "hover:bg-amber-100" : "hover:bg-green-100"} hover:text-amber-800 ${isSun ? "text-rose-500" : isSat ? "text-blue-500" : "text-slate-700"}`
                        : "text-slate-200 cursor-not-allowed"}`}>
                  {day}
                  {hasData && !isSelected && <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${orderMode === "dish" ? "bg-amber-400" : "bg-green-400"}`} />}
                </div>
              );
            })}
          </div>
          {value && (
            <div onClick={() => { onChange(""); setOpen(false); }}
              className="mt-3 w-full py-1.5 text-xs text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-100">
              清除選取日期
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── ShopDropdown ───────────────────────────────────────────────── */
function ShopDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const display = value ? options.find(o => o.value === value)?.label ?? value : "店家";
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${value
          ? "bg-orange-500 text-white border-amber-600 shadow-sm"
          : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700"
          }`}>
        <Store className="w-3.5 h-3.5" />
        <span>{display}</span>
        {value
          ? <span onMouseDown={e => { e.stopPropagation(); onChange(""); }} className="ml-0.5 cursor-pointer"><X className="w-3 h-3" /></span>
          : <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        }
      </div>
      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 min-w-[140px] bg-white border border-slate-200 rounded-xl shadow-xl py-1.5">
          <div onClick={() => { onChange(""); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50">全部</div>
          {options.map(o => (
            <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-amber-50 hover:text-amber-800 ${value === o.value ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700"}`}>
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all";

/* ─── Select ────────────────────────────────────────────────────── */
function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8`}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const AdminMealOrder = () => {

  // AI生成
  const [modal, setModal] = useState(null); // { type: "add"|"edit"|"delete", entity, data }

  /* ─── CRUD helpers ───────── */
  const closeModal = () => setModal(null);

  const [systemMode, setSystemMode] = useState("base");
  const [today, setToday] = useState([]);
  const { user } = useAdminUser();
  const [chargedSeatNumber, setChargedSeatNumber] = useState();
  const [isOrderOverview, setIsOrderOverview] = useState(false);
  const [isOrderable, setIsOrderable] = useState(false);
  const [isBubbleTeaOrderable, setIsBubbleTeaOrderable] = useState(false);
  const [bubbleteaOrderURL, setBubbleteaOrderURL] = useState("");
  const [orderType, setOrderType] = useState("1");
  const [orderRound, setOrderRound] = useState(1);
  const [allshops, setAllshops] = useState([]);
  const [thisdayshop, setThisdayshop] = useState();

  /* ── 週間預設店家 ── */
  const WEEKDAYS = [
    { key: 1, label: "週一", en: "MON" },
    { key: 2, label: "週二", en: "TUE" },
    { key: 3, label: "週三", en: "WED" },
    { key: 4, label: "週四", en: "THU" },
    { key: 5, label: "週五", en: "FRI" },
    { key: 6, label: "週六", en: "SAT" },
    { key: 0, label: "週日", en: "SUN" },
  ];

  // 初始值 { mon: "", tue: "", ... }
  const initMap = () => Object.fromEntries(WEEKDAYS.map(d => [d.key, ""]));
  const [schedule, setSchedule] = useState(initMap);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // 儲存成功短暫提示



  /* ── 訂單管理 ── */
  const [allorders, setAllorders] = useState([]);
  const [allbubbleteaorders, setAllbubbleteaorders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [filterPaid, setFilterPaid] = useState("");
  const [filterCancelled, setFilterCancelled] = useState("");
  const [page, setPage] = useState(1);
  const [bubbleteaPage, setBubbleteaPage] = useState(1);
  const [orderMode, setOrderMode] = useState("dish");

  const anyFilter = filterDate || filterShop || filterPaid !== "" || filterCancelled !== "";

  /* ── 篩選後資料 ── */
  const filtered = allorders?.filter(o => {
    const q = search.trim().toLowerCase();
    if (q) {
      const match =
        String(o.seat_number).includes(q) ||
        (o.order_date || "").includes(q) ||
        (o.shop_name || "").toLowerCase().includes(q) ||
        (o.food_name || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterDate && o.order_date !== filterDate) return false;
    if (filterShop && o.shop_name !== filterShop) return false;
    if (filterPaid !== "" && String(o.is_paid) !== filterPaid) return false;
    if (filterCancelled === "1" && o.delete_flag !== 1) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered?.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);


  const bubbleteaFiltered = allbubbleteaorders?.filter(o => {
    const q = search.trim().toLowerCase();
    if (q) {
      const match =
        String(o.seat_number).includes(q) ||
        (o.order_date || "").includes(q) ||
        (o.bubbletea_name || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterDate && o.order_date !== filterDate) return false;
    if (filterPaid !== "" && String(o.is_paid) !== filterPaid) return false;
    if (filterCancelled === "1" && o.delete_flag !== 1) return false;
    return true;
  });

  const totalBubbleteaPages = Math.max(1, Math.ceil(bubbleteaFiltered?.length / PAGE_SIZE));
  const bubbleteaSafePage = Math.min(bubbleteaPage, totalBubbleteaPages);
  const bubbleteaPageItems = bubbleteaFiltered.slice((bubbleteaSafePage - 1) * PAGE_SIZE, bubbleteaSafePage * PAGE_SIZE);


  useEffect(() => { setPage(1); }, [search, filterDate, filterShop, filterPaid, filterCancelled]);

  useEffect(() => { setBubbleteaPage(1); }, [search, filterDate, filterPaid, filterCancelled]);

  /* ── 可選日期 / 店家 ── */
  const dates = [...new Set(allorders.map(o => o.order_date).filter(Boolean))].sort().reverse();
  const shops = [...new Set(allorders.map(o => o.shop_name).filter(Boolean))].sort();

  /* ── 頁碼列表 ── */
  const pageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 1 && i <= safePage + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    return pages;
  };

  const bubbleteaPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalBubbleteaPages; i++) {
      if (i === 1 || i === totalBubbleteaPages || (i >= bubbleteaSafePage - 1 && i <= bubbleteaSafePage + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    return pages;
  };

  /* ── API ── */
  const fetchManagerControl = async () => {
    try {
      const res = await api.get('/api/getManagerControl');
      if (res.status === 200) {
        const controls = res.data.controls;
        const find = (key) => controls.find(i => i.c_title === key);
        setIsOrderable(find("isOrderable")?.c_value === "Y");
        setIsBubbleTeaOrderable(find("isBubbleTeaOrderable")?.c_value === "Y");
        setBubbleteaOrderURL(find("bubble_tea_url")?.c_value || "");
        setChargedSeatNumber(find("charged_seat_number")?.c_value);
        setOrderType(find("order_type")?.c_value || "1");
        setOrderRound(Number(find("order_round")?.c_value) || 1);
        setThisdayshop(Number(find("thisday_shop_id")?.c_value));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    api.get("/api/getUserIP").then(res => { if (res.status === 200) setToday(res.data.today); }).catch(() => { });
    api.get('/api/getAllShops').then(res => {
      if (res.status === 200) setAllshops(res.data.AllShops.filter(s => ![4, 5].includes(s.shop_id)));
    }).catch(() => { });
    api.get('/api/GetAlloders').then(res => {
      if (res.status === 200) {
        setAllorders(res.data.Allorders.sort((a, b) => {
          const d = new Date(b.order_date) - new Date(a.order_date);
          return d !== 0 ? d : Number(a.seat_number) - Number(b.seat_number);
        }));
      }
    }).catch(() => { });
    api.get('/api/GetAllbubbleteaorders').then(res => {
      if (res.status === 200) {
        setAllbubbleteaorders(res.data.Allbubbleteaorders.sort((a, b) => {
          const d = new Date(b.order_date) - new Date(a.order_date);
          return d !== 0 ? d : Number(a.seat_number) - Number(b.seat_number);
        }));
      }
    }).catch(() => { });

    api.get('/api/GetWdayShops').then(res => {
      if (res.status === 200) {
        // 轉成 { 0: "3", 1: "1", 2: "5", ... } 方便直接對應 schedule state
        const map = {};
        res.data.schedules.forEach(item => {
          map[item.wday] = String(item.shop_id);
        });
        setSchedule(prev => ({ ...prev, ...map }));
      }
    }).catch(() => { });

    fetchManagerControl();
  }, []);

  useEffect(() => {
    setIsOrderOverview(isOrderable || isBubbleTeaOrderable);
  }, [isOrderable, isBubbleTeaOrderable]);

  const subMenuItems = [
    { id: 'base', name: '主選單', icon: ClipboardList },
    { id: 'weekly-shop', name: '週間預設店家', icon: Store },
    { id: 'today-order', name: '今日點餐管理', icon: Calendar },
    { id: 'meal-settings', name: '餐點設定管理', icon: SlidersHorizontal },
    { id: 'order-management', name: '訂單管理', icon: ShoppingCart },
  ];

  const menuItems = [
    { id: 'latest-news', name: '最新資訊', icon: Newspaper, url: '#latest-news', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 'meal-order', name: '餐飲管理', icon: Utensils, url: '#meal-order', color: 'orange', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
    { id: 'environment', name: '環境管理', icon: Sparkles, url: '#environment', color: 'emerald', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { id: 'class-meeting', name: '班務會議', icon: Calendar, url: '#class-meeting', color: 'purple', bgColor: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { id: 'tech-forum', name: '知識論壇', icon: MessageSquare, url: '#tech-forum', color: 'cyan', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { id: 'data-analysis', name: '數據分析', icon: BarChart3, url: '#data-analysis', color: 'indigo', bgColor: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { id: 'ai', name: 'AI 應用', icon: Brain, url: '#ai', color: 'pink', bgColor: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
    { id: 'team', name: '開發團隊', icon: Users, url: '#team', color: 'teal', bgColor: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
  ];

  const getContentForMenu = (menuId) => {
    const content = {
      'latest-news': {
        title: '最新資訊',
        description: '系統動態與重要通知',
        items: [
          { name: '系統更新通知', status: 'new', date: '2024-02-15' },
          { name: '重要公告', status: 'important', date: '2024-02-14' },
          { name: '活動資訊', status: 'normal', date: '2024-02-13' },
          { name: '政策更新', status: 'normal', date: '2024-02-12' },
          { name: '維護通知', status: 'normal', date: '2024-02-11' },
          { name: '功能上線', status: 'new', date: '2024-02-10' }
        ]
      },
      'meal-order': {
        title: '餐飲管理',
        description: '餐點訂購與飲食安排',
        items: [
          { name: '今日菜單', status: 'active', date: '2024-02-15' },
          { name: '訂餐記錄', status: 'normal', date: '2024-02-15' },
          { name: '飲食偏好設定', status: 'normal', date: '2024-02-14' },
          { name: '營養分析', status: 'normal', date: '2024-02-13' },
          { name: '供應商管理', status: 'normal', date: '2024-02-12' },
          { name: '費用統計', status: 'normal', date: '2024-02-11' }
        ]
      },
      'environment': {
        title: '環境管理',
        description: '環境清潔與維護',
        items: [
          { name: '清潔排程', status: 'active', date: '2024-02-15' },
          { name: '環境檢查', status: 'normal', date: '2024-02-14' },
          { name: '設備維護', status: 'normal', date: '2024-02-13' },
          { name: '物資管理', status: 'normal', date: '2024-02-12' },
          { name: '品質評估', status: 'normal', date: '2024-02-11' },
          { name: '改善建議', status: 'normal', date: '2024-02-10' }
        ]
      },
      'class-meeting': {
        title: '班務會議',
        description: '會議安排與記錄',
        items: [
          { name: '會議日程', status: 'active', date: '2024-02-15' },
          { name: '會議記錄', status: 'normal', date: '2024-02-14' },
          { name: '待辦事項', status: 'important', date: '2024-02-13' },
          { name: '決議追蹤', status: 'normal', date: '2024-02-12' },
          { name: '參會人員', status: 'normal', date: '2024-02-11' },
          { name: '會議室預約', status: 'normal', date: '2024-02-10' }
        ]
      },
      'tech-forum': {
        title: '知識論壇',
        description: '技術交流與知識分享',
        items: [
          { name: '熱門話題', status: 'active', date: '2024-02-15' },
          { name: '我的文章', status: 'normal', date: '2024-02-14' },
          { name: '收藏內容', status: 'normal', date: '2024-02-13' },
          { name: '專家問答', status: 'normal', date: '2024-02-12' },
          { name: '學習資源', status: 'normal', date: '2024-02-11' },
          { name: '技術分享', status: 'new', date: '2024-02-10' }
        ]
      },
      'data-analysis': {
        title: '數據分析',
        description: '數據統計與分析報表',
        items: [
          { name: '數據儀表板', status: 'active', date: '2024-02-15' },
          { name: '統計報表', status: 'normal', date: '2024-02-14' },
          { name: '趨勢分析', status: 'normal', date: '2024-02-13' },
          { name: '績效指標', status: 'normal', date: '2024-02-12' },
          { name: '預測模型', status: 'normal', date: '2024-02-11' },
          { name: '數據匯出', status: 'normal', date: '2024-02-10' }
        ]
      },
      'ai': {
        title: 'AI 應用',
        description: '人工智慧與機器學習',
        items: [
          { name: '模型訓練', status: 'active', date: '2024-02-15' },
          { name: '預測分析', status: 'normal', date: '2024-02-14' },
          { name: 'AI 工具', status: 'new', date: '2024-02-13' },
          { name: '智能推薦', status: 'normal', date: '2024-02-12' },
          { name: '自動化流程', status: 'normal', date: '2024-02-11' },
          { name: '效能優化', status: 'normal', date: '2024-02-10' }
        ]
      },
      'team': {
        title: '開發團隊',
        description: '團隊協作與專案管理',
        items: [
          { name: '專案列表', status: 'active', date: '2024-02-15' },
          { name: '任務分配', status: 'important', date: '2024-02-14' },
          { name: '團隊成員', status: 'normal', date: '2024-02-13' },
          { name: '進度追蹤', status: 'normal', date: '2024-02-12' },
          { name: '協作工具', status: 'normal', date: '2024-02-11' },
          { name: '績效評估', status: 'normal', date: '2024-02-10' }
        ]
      }
    };
    return content[menuId];
  };

  const currentContent = getContentForMenu("meal-order");

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-700 border border-blue-200',
      important: 'bg-red-100 text-red-700 border border-red-200',
      active: 'bg-green-100 text-green-700 border border-green-200',
      normal: 'bg-gray-100 text-gray-700 border border-gray-200'
    };
    const labels = {
      new: '新',
      important: '重要',
      active: '進行中',
      normal: '一般'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const activeMenuItem = menuItems.find(item => item.id === "meal-order");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchUserIP = async () => {
      try {
        const res = await api.get("/api/getUserIP");
        if (res.status === 200) {
          if (Array.isArray(today) && today.length === 0) {
            setToday(res.data.today);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserIP();
  }, []);

  const handleOrderOverview = async (newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeOrderOverview", { enabled: newState });
      if (res.status === 200) {
        // setIsOrderOverview(newState); // 成功後才更新 UI
        // setIsOrderable(newState);
        // setIsBubbleTeaOrderable(newState);
        fetchManagerControl();
      }
    } catch (err) {
      console.error("更新狀態失敗:", err);
      // 可以選擇加提示
      Swal.fire({
        title: "更新狀態失敗，請稍後再試",
        icon: "error",
      });
    }
  };

  const handleIsMealActive = async (newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeIsMealActive", { enabled: newState });
      if (res.status === 200) {
        // setIsOrderable(newState); // 成功後才更新 UI
        fetchManagerControl();
      }
    } catch (err) {
      console.error("更新狀態失敗:", err);
      // 可以選擇加提示
      Swal.fire({
        title: "更新狀態失敗，請稍後再試",
        icon: "error",
      });
    }
  };

  const handleIsDrinkActive = async (newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeIsDrinkActive", { enabled: newState });
      if (res.status === 200) {
        // setIsBubbleTeaOrderable(newState); // 成功後才更新 UI
        fetchManagerControl();
      }
    } catch (err) {
      console.error("更新狀態失敗:", err);
      // 可以選擇加提示
      Swal.fire({
        title: "更新狀態失敗，請稍後再試",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (isOrderable || isBubbleTeaOrderable) {
      setIsOrderOverview(true);
    } else {
      setIsOrderOverview(false);
    }
  }, [isOrderable, isBubbleTeaOrderable])

  const updateThisdayshop = async (value) => {
    try {
      const res = await api.post('/api/updateThisdayshop', {
        thisday_shop_id: value,
      });
      if (res.status === 200) {
        fetchManagerControl();
      } else {
        console.error('更新失敗', res.data.message);
      }
    } catch (err) {
      console.error('更新狀態失敗:', err);
    }
  };

  const updateChargedSeatNumber = async (value) => {
    try {
      const res = await api.post('/api/updateChargedSeatNumber', {
        charged_seat_number: value,
      });
      if (res.status === 200) {
        fetchManagerControl();
      } else {
        console.error('更新失敗', res.data.message);
      }
    } catch (err) {
      console.error('更新狀態失敗:', err);
    }
  };

  const updateBubbleteaOrderURL = async (value) => {
    try {
      const res = await api.post('/api/updateBubbleteaOrderURL', {
        bubble_tea_url: value,
      });
      if (res.status === 200) {
        fetchManagerControl();
      } else {
        console.error('更新失敗', res.data.message);
      }
    } catch (err) {
      console.error('更新狀態失敗:', err);
    }
  };

  const updateOrderType = async (value) => {
    try {
      const res = await api.post('/api/updateOrderType', {
        order_type: value,
      });
      if (res.status === 200) {
        fetchManagerControl();
      } else {
        console.error('更新失敗', res.data.message);
      }
    } catch (err) {
      console.error('更新狀態失敗:', err);
    }
  };

  const updateOrderRound = async (value) => {
    try {
      const res = await api.post('/api/updateOrderRound', {
        order_round: value,
      });
      if (res.status === 200) {
        fetchManagerControl();
      } else {
        console.error('更新失敗', res.data.message);
      }
    } catch (err) {
      console.error('更新狀態失敗:', err);
    }

  };

  const saveOrder = (data) => {
    const fetchUpdateOrder = async () => {
      const order_id = Number(data?.order_id);
      const payload = {
        ...data,
        order_id
      };
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/updateOrder", payload);
        if (res.status === 200) {
          Swal.fire({
            title: "訂單更新成功",
            icon: "success",
          });
          setAllorders(prev =>
            prev.map(order =>
              order.order_id === payload.order_id ? payload : order
            )
          );
        }
      } catch (err) {
        console.error("訂單更新失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "訂單更新失敗，請稍後再試",
          icon: "error",
        });
      } finally {
        closeModal();
      }
    }
    fetchUpdateOrder();
  };

  const deleteOrder = (order_id) => {
    const fetchDeleteOrder = async () => {
      closeModal();
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/deleteOrder", { order_id });
        if (res.status === 200) {
          Swal.fire({
            title: "訂單刪除成功",
            icon: "success",
          });
          setAllorders(prev =>
            prev.map(order =>
              order.order_id === order_id ? { ...order, delete_flag: 1 } : order
            )
          );
        }
      } catch (err) {
        console.error("訂單刪除失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "訂單刪除失敗，請稍後再試",
          icon: "error",
        });
      }
    }
    fetchDeleteOrder();
  };



  const saveBubbleteaOrder = (data) => {
    const fetchUpdateBubbleteaOrder = async () => {
      const bubbletea_order_id = Number(data?.bubbletea_order_id);
      const payload = {
        ...data,
        bubbletea_order_id
      };
      if (!data.bubbletea_name?.trim()) return Swal.fire({ title: "請輸入飲料名稱", icon: "warning", });
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/updateBubbleteaOrder", payload);
        if (res.status === 200) {
          Swal.fire({
            title: "飲料訂單更新成功",
            icon: "success",
          });
          setAllbubbleteaorders(prev =>
            prev.map(order =>
              order.bubbletea_order_id === payload.bubbletea_order_id ? payload : order
            )
          );
        }
      } catch (err) {
        console.error("飲料訂單更新失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "飲料訂單更新失敗，請稍後再試",
          icon: "error",
        });
      } finally {
        closeModal();
      }
    }
    fetchUpdateBubbleteaOrder();
  };

  const deleteBubbleteaOrder = (bubbletea_order_id) => {
    const fetchDeleteBubbleteaOrder = async () => {
      closeModal();
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/deleteBubbleteaOrder", { bubbletea_order_id });
        if (res.status === 200) {
          Swal.fire({
            title: "飲料訂單刪除成功",
            icon: "success",
          });
          setAllbubbleteaorders(prev =>
            prev.map(order =>
              order.bubbletea_order_id === bubbletea_order_id ? { ...order, delete_flag: 1 } : order
            )
          );
        }
      } catch (err) {
        console.error("飲料訂單刪除失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "飲料訂單刪除失敗，請稍後再試",
          icon: "error",
        });
      }
    }
    fetchDeleteBubbleteaOrder();
  };



  const clearAll = () => {
    setSearch("");
    setFilterDate("");
    setFilterShop("");
    setFilterPaid("");
    setFilterCancelled("");
  };

  /* ─── Render modal content ─ */
  const renderModal = () => {
    if (!modal) return null;
    const { type, entity, data } = modal;
    /* DELETE */
    if (type === "delete") {
      if (entity === "orders") {
        const date = data.order_date;
        const name = data.food_name;
        const onConfirm = () => deleteOrder(data.order_id);
        return <DeleteModal date={date} name={name} onClose={closeModal} onConfirm={onConfirm} />;
      }
      if (entity === "bubbleteaorders") {
        const date = data.order_date;
        const name = data.bubbletea_name;
        const onConfirm = () => deleteBubbleteaOrder(data.bubbletea_order_id);
        return <DeleteModal date={date} name={name} onClose={closeModal} onConfirm={onConfirm} />;
      }
    }

    if (entity === "orders") {
      const [form, setForm] = [data, (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }))];

      return (
        <Modal title="編輯訂單"
          onClose={closeModal} onConfirm={() => saveOrder({ ...form, price: Number(form.price) })}
          confirmColor="bg-orange-500 hover:bg-orange-600">

          <Field label="付款狀態" required>
            <div className="flex gap-4">
              {[
                { value: 1, label: "已付款", color: "emerald" },
                { value: 0, label: "未付款", color: "orange" },
              ].map(({ value, label, color }) => {
                const selected = form.is_paid === value;
                return (
                  <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="is_paid"
                      value={value}
                      checked={selected}
                      onChange={() => setForm({ is_paid: value })}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected
                      ? color === "emerald" ? "border-emerald-500 bg-emerald-500" : "border-orange-500 bg-orange-500"
                      : "border-slate-300 bg-white"
                      }`}>
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={`text-sm font-medium transition-colors ${selected
                      ? color === "emerald" ? "text-emerald-600" : "text-orange-500"
                      : "text-slate-400"
                      }`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label="備註">
            <input
              type="text"
              className={inputCls}
              placeholder="輸入備註（選填）"
              value={form.remark ?? ""}
              onChange={e => setForm({ remark: e.target.value })}
            />
          </Field>

        </Modal>
      );
    }
    if (entity === "bubbleteaorders") {
      const [bubbleteaform, setBubbleteaForm] = [data, (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }))];

      return (
        <Modal title="編輯飲料訂單"
          onClose={closeModal} onConfirm={() => saveBubbleteaOrder({ ...bubbleteaform, price: Number(bubbleteaform.bubbletea_price) })}
          confirmColor="bg-orange-500 hover:bg-orange-600">

          <Field label="付款狀態" required>
            <div className="flex gap-4">
              {[
                { value: 1, label: "已付款", color: "emerald" },
                { value: 0, label: "未付款", color: "orange" },
              ].map(({ value, label, color }) => {
                const selected = bubbleteaform.is_paid === value;
                return (
                  <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="is_paid"
                      value={value}
                      checked={selected}
                      onChange={() => setBubbleteaForm({ is_paid: value })}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected
                      ? color === "emerald" ? "border-emerald-500 bg-emerald-500" : "border-orange-500 bg-orange-500"
                      : "border-slate-300 bg-white"
                      }`}>
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={`text-sm font-medium transition-colors ${selected
                      ? color === "emerald" ? "text-emerald-600" : "text-orange-500"
                      : "text-slate-400"
                      }`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label="餐點名稱" required>
            <input
              type="text"
              className={inputCls}
              placeholder="例如：珍珠奶茶"
              value={bubbleteaform.bubbletea_name ?? ""}
              onChange={e => setBubbleteaForm({ bubbletea_name: e.target.value })}
            />
          </Field>

        </Modal>
      );
    }
  };

  // 週間預設店家

  const handleChange = (day, shopId) => {
    setSchedule(prev => ({ ...prev, [day]: shopId }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = WEEKDAYS.map(({ key }) => ({
        wday: key,
        shop_id: schedule[key] ? Number(schedule[key]) : null,
      }));

      await api.post("/api/updateWdayShops", { schedule: payload });
      Swal.fire({ title: "儲存成功", icon: "success" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      Swal.fire({ title: "儲存失敗，請稍後再試", icon: "error" });
    } finally {
      setSaving(false);
    }
  };

  const shopOptions = allshops.map(s => ({ value: String(s.shop_id), label: s.shop_name }));

  const DAY_COLORS = {
    1: { ring: "ring-orange-300", dot: "bg-orange-400", badge: "bg-orange-50 text-orange-600 border-orange-200", accent: "text-orange-500" },
    2: { ring: "ring-amber-300", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-600 border-amber-200", accent: "text-amber-500" },
    3: { ring: "ring-yellow-300", dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-600 border-yellow-200", accent: "text-yellow-500" },
    4: { ring: "ring-lime-300", dot: "bg-lime-500", badge: "bg-lime-50 text-lime-700 border-lime-200", accent: "text-lime-600" },
    5: { ring: "ring-emerald-300", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", accent: "text-emerald-600" },
    6: { ring: "ring-blue-300", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-600 border-blue-200", accent: "text-blue-500" },
    0: { ring: "ring-rose-300", dot: "bg-rose-400", badge: "bg-rose-50 text-rose-600 border-rose-200", accent: "text-rose-500" },
  };


  return (
    <div className="d-block min-h-screen bg-slate-50">
      <div className="flex">
        {/* ✅ min-w-0 防止 flex 子元素撐破父容器寬度 */}
        <main className="flex-1 min-w-0 transition-all duration-300 lg:ml-0">

          {/* Header Section */}
          {/* ✅ overflow-hidden 讓 header 本身不溢出 */}
          <div className="bg-white border-b border-gray-200">

            {/* Title Row */}
            <div className="px-6 lg:px-8 pt-6 pb-0 flex items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`shrink-0 p-3 ${activeMenuItem?.bgColor} rounded-xl shadow-sm`}>
                  {React.createElement(activeMenuItem?.icon, { className: "h-6 w-6 text-white" })}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-slate-900 truncate">{currentContent?.title}</h2>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">{currentContent?.description}</p>
                </div>
              </div>
              <div className="ml-auto shrink-0">
                <div className={`px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:scale-105 cursor-pointer`}>
                  <span>新增項目</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <div className="flex gap-1 px-6 lg:px-8" style={{ minWidth: 'max-content' }}>
                {subMenuItems.map((item) => {
                  const isActive = systemMode === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSystemMode(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 rounded-t-lg
                        ${isActive
                          ? 'text-orange-600 bg-orange-50 border-orange-500'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                        }
                      `}
                    >
                      {React.createElement(item.icon, {
                        className: `h-4 w-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400'}`
                      })}
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Page Content */}
          {systemMode === "base" &&
            <div className="px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">1,234</div>
                  <div className="text-sm text-gray-600 mt-1">總訪問次數</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">+8%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">856</div>
                  <div className="text-sm text-gray-600 mt-1">活躍用戶</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">23 項</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">23</div>
                  <div className="text-sm text-gray-600 mt-1">待處理事項</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">100%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">正常</div>
                  <div className="text-sm text-gray-600 mt-1">系統狀態</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-slate-900">項目列表</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">項目名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">日期</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentContent?.items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 ${activeMenuItem?.bgColor} rounded-full`}></div>
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{item.date}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`text-sm ${activeMenuItem?.textColor} hover:opacity-70 font-medium inline-flex items-center gap-1 transition-opacity`}>
                              查看詳情
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {systemMode === "weekly-shop" &&
            <div className="px-4 lg:px-8 py-6">
              <div className="mx-auto max-w-2xl">
                {(user?.user && user.user.roles.includes("admin")) ? (
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl border border-orange-100 p-5 shadow-sm">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-base font-bold text-slate-800">週間店家排班</h3>
                        <p className="text-xs text-slate-400 mt-0.5">設定每週一到週日的預設訂餐店家</p>
                      </div>
                      <div
                        onClick={!saving ? handleSave : undefined}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all select-none
      ${saving ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer shadow-sm"}`}
                      >
                        {saving && (
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        )}
                        {saving ? "儲存中…" : "儲存設定"}
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-3">
                      {WEEKDAYS.map(({ key, label, en }) => {
                        const c = DAY_COLORS[key];
                        const selected = shopOptions.find(o => o.value === schedule[key]);
                        return (
                          <div key={key}
                            className={`bg-white rounded-xl border border-slate-100 px-4 py-3.5 flex items-center gap-4 shadow-sm ring-1 ${c.ring} ring-opacity-40 hover:ring-opacity-80 transition-all`}>

                            {/* Day badge */}
                            <div className="shrink-0 flex flex-col items-center w-12">
                              <span className={`text-[10px] font-bold tracking-widest ${c.accent}`}>{en}</span>
                              <span className="text-lg font-black text-slate-800 leading-tight">{label}</span>
                            </div>

                            {/* Divider dot */}
                            <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />

                            {/* Select */}
                            <div className="flex-1 relative">
                              <select
                                value={schedule[key]}
                                onChange={e => handleChange(key, e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all pr-8"
                              >
                                <option value="">— 未設定 —</option>
                                {shopOptions.map(o => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                            </div>

                            {/* Selected tag */}
                            {selected ? (
                              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}>
                                {selected.label}
                              </span>
                            ) : (
                              <span className="shrink-0 text-xs text-slate-300 font-medium w-16 text-right">未設定</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer hint */}
                    <p className="mt-4 text-[11px] text-slate-400 text-center">
                      此設定作為每日預設店家，可在「今日點餐管理」中個別覆蓋
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                    <div className='w-full text-center text-red-500 font-bold'>
                      本功能需管理權限，請洽系統管理員
                    </div>
                  </div>
                )}
              </div>
            </div>
          }

          {systemMode === "today-order" &&
            <div className="px-6 lg:px-8 py-6">
              <div className="mx-auto mb-8 max-w-2xl">
                {/* {(seatNumber == "0" || seatNumber == "2" || seatNumber == "25") ? ( */}
                {(user?.user && user.user.roles.includes("admin")) ? (
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                    <div>
                      <div className="inline-block bg-[rgb(255,239,234)] border border-[rgba(224,92,42,0.25)] text-[rgb(84,39,24)] text-xs px-[14px] py-1 rounded-full font-medium">
                        📅 {today.date}　{today.day}
                      </div>
                    </div>
                    <div className="mt-6 space-y-5 text-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-800">今日點餐設定</h3>
                        <span className="text-xs text-gray-400">今日有效</span>
                      </div>

                      <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
                        <div className="space-y-3">
                          {/* 今日點餐總覽 */}
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-gray-700">今日點餐總覽</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox"
                                className="sr-only peer"
                                checked={isOrderOverview}
                                // onChange={() => setIsOrderOverview(!isOrderOverview)}
                                onChange={() => handleOrderOverview(!isOrderOverview)}
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                              <span className="ml-3 text-sm text-gray-700 peer-checked:hidden">關閉</span>
                              <span className="ml-3 text-sm text-gray-700 hidden peer-checked:inline">啟用</span>
                            </label>
                          </div>

                          {/* 餐點啟用狀態 */}
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-gray-700">餐點啟用狀態</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox"
                                className="sr-only peer"
                                checked={isOrderable}
                                onChange={() => handleIsMealActive(!isOrderable)}
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                              <span className="ml-3 text-sm text-gray-700 peer-checked:hidden">關閉</span>
                              <span className="ml-3 text-sm text-gray-700 hidden peer-checked:inline">啟用</span>
                            </label>
                          </div>

                          {/* 飲料啟用狀態 */}
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-gray-700">飲料啟用狀態</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox"
                                className="sr-only peer"
                                checked={isBubbleTeaOrderable}
                                onChange={() => handleIsDrinkActive(!isBubbleTeaOrderable)}
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                              <span className="ml-3 text-sm text-gray-700 peer-checked:hidden">關閉</span>
                              <span className="ml-3 text-sm text-gray-700 hidden peer-checked:inline">啟用</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-gray-700">今日餐點店家</span>
                          <select className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-400 focus:outline-none"
                            value={thisdayshop}
                            onChange={(e) => {
                              let value = e.target.value;
                              updateThisdayshop(value);
                            }}
                          >
                            <option value="">請選擇今日餐點店家</option>
                            {allshops && allshops.map((shop) => {
                              return (
                                <option key={shop.shop_id} value={`${shop.shop_id}`}>{shop.shop_name}</option>
                              )
                            })}
                          </select>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-gray-700">點餐收費值日生（座號）</span>
                          <input
                            type="number"
                            value={chargedSeatNumber}
                            min={1}
                            max={29}
                            step={1}
                            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right focus:border-orange-400 focus:outline-none"
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (isNaN(value)) return;
                              if (value < 1) value = 1;
                              if (value > 29) value = 29;
                              setChargedSeatNumber(value);
                            }}
                            onBlur={() => {
                              updateChargedSeatNumber(chargedSeatNumber);
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 gap-3">
                          <span className="text-gray-700 shrink-0">飲料揪團網址：</span>
                          <input
                            type="text"
                            value={bubbleteaOrderURL}
                            className="flex-1 min-w-0 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-400 focus:outline-none"
                            placeholder="貼上連結"
                            onChange={(e) => {
                              let value = e.target.value;
                              setBubbleteaOrderURL(value);
                            }}
                            onBlur={() => {
                              updateBubbleteaOrderURL(bubbleteaOrderURL);
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-gray-700">餐點種類</span>
                          <select className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-400 focus:outline-none"
                            value={orderType}
                            onChange={(e) => {
                              let value = e.target.value;
                              updateOrderType(value);
                            }}
                          >
                            <option value="1">午餐</option>
                            <option value="2">晚餐</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-gray-700">總體餐點次數</span>
                          <span className="ml-auto flex items-center">
                            第<input
                              type="number"
                              value={orderRound}
                              min={1} max={10} step={1}
                              className="min-w-10 rounded-md border border-gray-300 mx-1 px-2 py-1 text-right focus:border-orange-400 focus:outline-none"
                              onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                if (value < 1) value = 1;
                                if (value > 10) value = 10;
                                setOrderRound(value);
                              }}
                              onBlur={() => {
                                updateOrderRound(orderRound);
                              }}
                            />輪點餐
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                    <div className='w-full text-center text-red-500 font-bold'>
                      本功能需管理權限，請洽系統管理員
                    </div>
                  </div>
                )}

              </div>
            </div>
          }

          {systemMode === "meal-settings" &&
            (user?.user && user.user.roles.includes("admin") ? (
              <RestaurantManager />
            ) : (
              <div className="px-6 lg:px-8 py-6">
                <div className="mx-auto mb-8 max-w-2xl">
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                    <div className='w-full text-center text-red-500 font-bold'>
                      本功能需管理權限，請洽系統管理員
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* ── 訂單管理 ── */}
          {systemMode === "order-management" && (
            <div className="px-4 lg:px-8 py-6">
              <div className="mx-auto max-w-6xl">
                {(user?.user && user.user.roles.includes("admin")) ? (
                  <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl border border-orange-100 p-5 shadow-sm">

                    {/* 搜尋 + 篩選 */}
                    <div className="flex flex-col gap-3 mb-4">
                      <div className='flex items-center'>
                        <div className="flex items-center space-x-2 mr-2">
                          {/* 午餐按鈕 */}
                          <div
                            onClick={() => { setOrderMode("dish"); clearAll() }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${orderMode === "dish"
                              ? "bg-orange-500 text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-gray-100"
                              }`}
                          >
                            午餐
                          </div>

                          {/* 手搖飲按鈕 */}
                          <div
                            onClick={() => { setOrderMode("bubbletea"); clearAll() }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${orderMode === "bubbletea"
                              ? "bg-green-600 text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-gray-100"
                              }`}
                          >
                            手搖飲
                          </div>
                        </div>
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" placeholder={`${orderMode === "dish" ? "搜尋座號、日期、店家、餐點…" : "搜尋座號、日期、飲料名稱…"}`} value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white shadow-sm" />
                          {search && (
                            <div onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              <X className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div onClick={clearAll}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${!anyFilter && !search ? "bg-orange-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>
                          全部
                        </div>
                        <CalendarPicker orderMode={orderMode} value={filterDate} onChange={setFilterDate} availableDates={dates} />
                        {orderMode === "dish" && <ShopDropdown value={filterShop} onChange={setFilterShop} options={shops.map(s => ({ value: s, label: s }))} />}
                        <div onClick={() => setFilterPaid(p => p === "1" ? "" : "1")}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${filterPaid === "1" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"}`}>
                          ✓ 已付款
                        </div>
                        <div onClick={() => setFilterPaid(p => p === "0" ? "" : "0")}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${filterPaid === "0" ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200 hover:border-rose-400 hover:text-rose-600"}`}>
                          ✕ 未付款
                        </div>
                        <div onClick={() => setFilterCancelled(p => p === "1" ? "" : "1")}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${filterCancelled === "1" ? "bg-slate-500 text-white border-slate-500" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                          ⊘ 已取消
                        </div>
                        {(anyFilter || search) && (
                          <div onClick={clearAll} className="ml-auto flex items-center gap-1 px-2.5 py-2 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="w-3 h-3" /> 清除篩選
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 表格 */}
                    {orderMode === "dish" &&
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="h-12 border-b border-slate-100 bg-orange-400 text-xs text-gray-700">
                                {["座號", "日期", "第幾輪", "店家", "餐點", "數量", "金額", "付款", "備註", "操作"].map(h => (
                                  <th key={h} className="px-3 py-3 text-center font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {pageItems.length === 0 ? (
                                <tr><td colSpan={10} className="py-16 text-center text-slate-400 text-sm">
                                  <div className="text-3xl mb-2">🍽️</div>查無符合條件的訂單
                                </td></tr>
                              ) : pageItems.map(order => (
                                <tr key={order.order_id}
                                  className={`transition-colors duration-100 ${order.delete_flag === 1
                                    ? "opacity-40 bg-slate-100 line-through"
                                    : "odd:bg-[rgb(255,251,244)] even:bg-white hover:bg-gradient-to-t hover:from-orange-300 hover:via-amber-300 hover:to-orange-300 hover:shadow-sm cursor-pointer"}`}
                                  onDoubleClick={() => { if (order.delete_flag !== 1) setModal({ type: "edit", entity: "orders", data: { ...order } }); }}>
                                  <td className="px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">{order.seat_number}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-center text-slate-600">{order.order_date || "—"}</td>
                                  <td className="px-3 py-3 text-center font-bold text-gray-800">{order.order_round}</td>
                                  <td className="px-3 py-3 text-center font-medium text-slate-700">{order.shop_name || "—"}</td>
                                  <td className="px-3 py-3 text-center text-slate-700">{order.food_name}</td>
                                  <td className="px-3 py-3 text-center text-slate-600">{order.quantity}</td>
                                  <td className="px-3 py-3 text-center font-semibold text-slate-800">${Number(order.price) * order.quantity}</td>
                                  <td className="px-3 py-3 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.delete_flag === 1 ? "bg-rose-100 text-rose-600"
                                      : order.is_paid === 1 ? "bg-emerald-100 text-emerald-700"
                                        : order.order_date === today?.date ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-200 text-gray-600"}`}>
                                      {order.delete_flag === 1 ? "已取消" : order.is_paid === 1 ? "已付款" : order.order_date === today?.date ? "未付款" : "未完成"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center text-slate-500 text-xs max-w-[80px] truncate">{order.remark || ""}</td>
                                  <td className="px-3 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                      <div className={`p-1.5 rounded-lg transition-all ${order.delete_flag === 1 ? "text-slate-300 cursor-not-allowed" : "text-blue-400 hover:text-white hover:bg-blue-400 cursor-pointer"}`}
                                        onClick={() => { if (order.delete_flag !== 1) setModal({ type: "edit", entity: "orders", data: { ...order } }); }}>
                                        <div className="relative">
                                          <Pen className="w-3.5 h-3.5" />
                                          {order.delete_flag === 1 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-[1.5px] bg-slate-400 rotate-[-45deg]" /></div>}
                                        </div>
                                      </div>
                                      <div className={`p-1.5 rounded-lg transition-all ${order.delete_flag === 1 ? "text-slate-300 cursor-not-allowed" : "text-red-400 hover:text-white hover:bg-red-400 cursor-pointer"}`}
                                        onClick={() => { if (order.delete_flag !== 1) setModal({ type: "delete", entity: "orders", data: order }); }}>
                                        <div className="relative">
                                          <Trash2 className="w-3.5 h-3.5" />
                                          {order.delete_flag === 1 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-[1.5px] bg-slate-400 rotate-[-45deg]" /></div>}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 分頁 Footer */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                          <span className="text-xs text-slate-400">
                            共 <span className="font-semibold text-slate-600">{filtered.length}</span> 筆 ／
                            第 <span className="font-semibold text-slate-600">{safePage}</span> / <span className="font-semibold text-slate-600">{totalPages}</span> 頁
                          </span>
                          <div className="flex items-center gap-1">
                            <div disabled={safePage === 1} onClick={() => { if (page > 1) setPage(p => p - 1) }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-amber-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                            {pageNumbers().map((p, i) =>
                              p === "…"
                                ? <span key={`e${i}`} className="px-1.5 text-xs text-slate-400">…</span>
                                : <div key={p} onClick={() => setPage(p)}
                                  className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold transition-all flex justify-center items-center ${p === safePage ? "bg-amber-500 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-amber-600 hover:border-slate-300"}`}>
                                  {p}
                                </div>
                            )}
                            <div disabled={safePage === totalPages} onClick={() => { if (page < totalPages) setPage(p => p + 1) }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-amber-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {orderMode === "bubbletea" &&
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="h-12 border-b border-slate-100 bg-green-400 text-xs text-gray-700">
                                {["座號", "日期", "飲料名稱", "金額", "付款", "操作"].map(h => (
                                  <th key={h} className="px-3 py-3 text-center font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {bubbleteaPageItems.length === 0 ? (
                                <tr><td colSpan={10} className="py-16 text-center text-slate-400 text-sm">
                                  <div className="text-3xl mb-2">🍽️</div>查無符合條件的訂單
                                </td></tr>
                              ) : bubbleteaPageItems.map(order => (
                                <tr key={order.bubbletea_order_id}
                                  className={`transition-colors duration-100 ${order.delete_flag === 1
                                    ? "opacity-40 bg-slate-100 line-through"
                                    : "odd:bg-[rgb(244,255,253)] even:bg-white hover:bg-gradient-to-t hover:from-green-300 hover:via-green-200 hover:to-green-300 hover:shadow-sm cursor-pointer"}`}
                                  onDoubleClick={() => { if (order.delete_flag !== 1) setModal({ type: "edit", entity: "bubbleteaorders", data: { ...order } }); }}>
                                  <td className="px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-sky-700 text-xs font-bold">{order.seat_number}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-center text-slate-600">{order.order_date || ""}</td>
                                  <td className="px-3 py-3 text-center text-slate-700">{order.bubbletea_name}</td>
                                  <td className="px-3 py-3 text-center font-semibold text-slate-800">${Number(order.bubbletea_price)}</td>
                                  <td className="px-3 py-3 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.delete_flag === 1 ? "bg-rose-100 text-rose-600"
                                      : order.is_paid === 1 ? "bg-emerald-100 text-emerald-700"
                                        : order.order_date === today?.date ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-200 text-gray-600"}`}>
                                      {order.delete_flag === 1 ? "已取消" : order.is_paid === 1 ? "已付款" : order.order_date === today?.date ? "未付款" : "未完成"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                      <div className={`p-1.5 rounded-lg transition-all ${order.delete_flag === 1 ? "text-slate-300 cursor-not-allowed" : "text-blue-400 hover:text-white hover:bg-blue-400 cursor-pointer"}`}
                                        onClick={() => { if (order.delete_flag !== 1) setModal({ type: "edit", entity: "bubbleteaorders", data: { ...order } }); }}>
                                        <div className="relative">
                                          <Pen className="w-3.5 h-3.5" />
                                          {order.delete_flag === 1 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-[1.5px] bg-slate-400 rotate-[-45deg]" /></div>}
                                        </div>
                                      </div>
                                      <div className={`p-1.5 rounded-lg transition-all ${order.delete_flag === 1 ? "text-slate-300 cursor-not-allowed" : "text-red-400 hover:text-white hover:bg-red-400 cursor-pointer"}`}
                                        onClick={() => { if (order.delete_flag !== 1) setModal({ type: "delete", entity: "bubbleteaorders", data: order }); }}>
                                        <div className="relative">
                                          <Trash2 className="w-3.5 h-3.5" />
                                          {order.delete_flag === 1 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-[1.5px] bg-slate-400 rotate-[-45deg]" /></div>}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 分頁 Footer */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                          <span className="text-xs text-slate-400">
                            共 <span className="font-semibold text-slate-600">{bubbleteaFiltered.length}</span> 筆 ／
                            第 <span className="font-semibold text-slate-600">{bubbleteaSafePage}</span> / <span className="font-semibold text-slate-600">{totalBubbleteaPages}</span> 頁
                          </span>
                          <div className="flex items-center gap-1">
                            <div disabled={bubbleteaSafePage === 1} onClick={() => { if (bubbleteaPage > 1) setBubbleteaPage(p => p - 1) }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-green-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                            {bubbleteaPageNumbers().map((p, i) =>
                              p === "…"
                                ? <span key={`e${i}`} className="px-1.5 text-xs text-slate-400">…</span>
                                : <div key={p} onClick={() => setBubbleteaPage(p)}
                                  className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold transition-all flex justify-center items-center ${p === bubbleteaSafePage ? "bg-green-500 text-white shadow-sm" : "border border-slate-200 text-slate-600 hover:bg-green-600 hover:border-slate-300"}`}>
                                  {p}
                                </div>
                            )}
                            <div disabled={bubbleteaSafePage === totalBubbleteaPages} onClick={() => { if (bubbleteaPage < totalBubbleteaPages) setBubbleteaPage(p => p + 1) }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-green-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                ) : (
                  <div className="mx-auto max-w-6xl">
                    <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                      <div className='w-full text-center text-red-500 font-bold'>
                        本功能需管理權限，請洽系統管理員
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div >
      {renderModal()}
    </div >
  );
};

export default AdminMealOrder;
