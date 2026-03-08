import React, { useState, useEffect } from "react";
import {
  Store, UtensilsCrossed, BookOpen,
  Plus, Pencil, Trash2, ChevronRight,
  X, Check, Search, ChevronDown
} from "lucide-react";
import Swal from "sweetalert2";
import api from "@/api/axios";

/* ─── Mock initial data ─────────────────────────────────────────── */
const initStores = [
  { id: 1, name: "老王牛肉麵", category: "中式", address: "台北市中山區" },
  { id: 2, name: "義大利小館", category: "西式", address: "台北市大安區" },
];
const initStyles = [
  { id: 1, storeId: 1, name: "乾麵系列" },
  { id: 2, storeId: 1, name: "湯麵系列" },
  { id: 3, storeId: 2, name: "燉飯系列" },
];
const initDishes = [
  { id: 1, styleId: 1, name: "麻醬乾麵", price: 120 },
  { id: 2, styleId: 1, name: "紅油抄手", price: 90 },
  { id: 3, styleId: 2, name: "紅燒牛肉湯麵", price: 160 },
  { id: 4, styleId: 3, name: "松露燉飯", price: 280 },
];

/* ─── Helpers ───────────────────────────────────────────────────── */
let _id = 100;
const uid = () => ++_id;

const TABS = [
  { key: "shops", label: "餐飲店家", icon: Store, color: "blue", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", badge: "bg-blue-50 text-blue-600 border-blue-200" },
  { key: "categories", label: "餐點類別", icon: UtensilsCrossed, color: "purple", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-100", text: "text-purple-600", badge: "bg-purple-50 text-purple-600 border-purple-200" },
  { key: "foods", label: "餐點名稱", icon: BookOpen, color: "orange", bg: "bg-orange-500", light: "bg-orange-50", border: "border-orange-100", text: "text-orange-600", badge: "bg-orange-50 text-orange-600 border-orange-200" },
];

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
            <Check className="w-4 h-4" />{confirmLabel}
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(-16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

/* ─── Delete Confirm Modal ──────────────────────────────────────── */
function DeleteModal({ name, onClose, onConfirm }) {
  return (
    <Modal title="確認刪除" onClose={onClose} onConfirm={onConfirm}
      confirmLabel="刪除" confirmColor="bg-red-500 hover:bg-red-600">
      <p className="text-sm text-gray-600">確定要刪除 <span className="font-bold text-slate-900">「{name}」</span> 嗎？此操作無法復原。</p>
    </Modal>
  );
}

/* ─── Field ─────────────────────────────────────────────────────── */
function Field({ label, required = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {required && <span className="text-red-500">*</span>}
        {label}
      </label>
      {React.cloneElement(children, { required })}
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

/* ─── Status Badge ──────────────────────────────────────────────── */
function Badge({ children, color }) {
  const map = {
    blue: "text-blue-700",
    purple: "text-purple-700",
    orange: "text-orange-700",
    green: "text-green-700",
    red: "text-red-700",
    rose: "text-rose-400",
  };
  return (
    <span className={`text-xs font-semibold px-4 py-1 rounded ${map[color] || map.blue}`}>{children}</span>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function RestaurantManager() {
  const [tab, setTab] = useState("shops");
  const [search, setSearch] = useState("");

  const [stores, setStores] = useState(initStores);
  const [styles, setStyles] = useState(initStyles);
  const [dishes, setDishes] = useState(initDishes);
  const [selectShop, setSelectShop] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [selectFood, setSelectFood] = useState(null);

  const [modal, setModal] = useState(null); // { type: "add"|"edit"|"delete", entity, data }


  const [allshops, setAllshops] = useState([]);
  const [allcategories, setAllcategories] = useState([]);
  const [allfoods, setAllFoods] = useState([]);

  const [filteredShops, setFilteredShops] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);

  const [showMenu, setShowMenu] = useState(false);

  const activeTab = TABS.find(t => t.key === tab);

  /* ─── Derived counts ─────── */
  const CategoryCount = shop_id => allcategories?.filter(c => c.shop_id === shop_id && c.delete_flag === 0).length;
  const foodCount = menu_category_id => allfoods?.filter(f => f.menu_category_id === menu_category_id && f.delete_flag === 0).length;

  useEffect(() => {
    const q = search?.toLowerCase();
    const updateShops = allshops?.filter(s => s.shop_name?.toLowerCase().includes(q) && s.delete_flag === 0);
    setFilteredShops(updateShops);
  }, [allshops, search])

  useEffect(() => {
    const q = search?.toLowerCase();
    const updateCategories = allcategories?.filter(c => c.category_name.toLowerCase().includes(q) && c.shop_id === selectShop?.shop_id && c.delete_flag === 0);
    setFilteredCategories(updateCategories);
  }, [allcategories, selectShop, search])

  useEffect(() => {
    const q = search?.toLowerCase();
    const updateFoods = allfoods?.filter(f => f.food_name.toLowerCase().includes(q) && f.menu_category_id === selectCategory?.menu_category_id && f.delete_flag === 0);
    setFilteredFoods(updateFoods);
  }, [allfoods, selectCategory, search])

  /* ─── CRUD helpers ───────── */
  const closeModal = () => setModal(null);

  // STORES
  const toggleStoreActive = async (shop_id, newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeIsShopActive", { shop_id: shop_id, enabled: newState });
      if (res.status === 200) {
        // 成功後才更新 UI
        setAllshops(prev =>
          prev.map(shop =>
            shop.shop_id === shop_id ? { ...shop, is_active: newState } : shop
          )
        );
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
  const saveShop = (data) => {
    if (!data.shop_id) {
      const fetchAddShop = async () => {
        if (!data.shop_name || data.shop_name.trim() === "") {
          Swal.fire({
            title: "請填寫店家名稱",
            icon: "warning"
          });
          return;
        }
        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/addShop", data);
          if (res.status === 200) {
            Swal.fire({
              title: "新增店家成功",
              icon: "success",
            });
            // 取得 shop 物件
            const newShop = res.data.shop;
            // 將 is_active 轉成 true / false
            const formattedShop = { ...newShop, is_active: newShop.is_active === 1 };
            // 加入 allshops
            setAllshops(prev => [...prev, formattedShop]);
            setSelectShop(formattedShop);
          }
        } catch (err) {
          if (err.response?.status === 400) {
            Swal.fire({
              title: "店家名稱重複，請重新設定",
              icon: "error",
            });
          } else {
            console.error("新增店家失敗:", err);
            Swal.fire({
              title: "新增店家失敗，請稍後再試",
              icon: "error",
            });
          }
        } finally {
          closeModal();
        }
      }
      fetchAddShop();
    } else {
      const fetchUpdateShop = async () => {
        if (!data.shop_name || data.shop_name.trim() === "") {
          Swal.fire({
            title: "請填寫店家名稱",
            icon: "warning"
          });
          return;
        }
        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/updateShop", data);
          if (res.status === 200) {
            Swal.fire({
              title: "店家資料更新成功",
              icon: "success",
            });
            setAllshops(prev =>
              prev.map(shop =>
                shop.shop_id === data.shop_id ? data : shop
              )
            );
            if (selectShop.shop_id === data.shop_id) {
              setSelectShop(data)
            }
          }
        } catch (err) {
          console.error("店家資料更新失敗:", err);
          // 可以選擇加提示
          Swal.fire({
            title: "店家資料更新失敗，請稍後再試",
            icon: "error",
          });
        } finally {
          closeModal();
        }
      }
      fetchUpdateShop();
    }
  };
  const deleteShop = (shop_id) => {
    const fetchDeleteShop = async () => {
      closeModal();
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/deleteShop", { shop_id });
        if (res.status === 200) {
          Swal.fire({
            title: "刪除店家成功",
            icon: "success",
          });
          setAllshops(prev =>
            prev.map(shop =>
              shop.shop_id === shop_id ? { ...shop, delete_flag: 1 } : shop
            )
          );
          if (selectShop?.shop_id === shop_id) {
            setSelectShop(null);
            setSelectCategory(null);
            setSelectFood(null);
          }
        }
      } catch (err) {
        console.error("刪除店家失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "刪除店家失敗，請稍後再試",
          icon: "error",
        });
      }
    }
    fetchDeleteShop();
  };

  // STYLES
  const toggleCategoryActive = async (menu_category_id, newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeIsCategoryActive", { menu_category_id: menu_category_id, enabled: newState });
      if (res.status === 200) {
        setAllcategories(prev =>
          prev.map(category =>
            category.menu_category_id === menu_category_id ? { ...category, is_active: newState } : category
          )
        );
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
  const saveCategory = (data) => {
    if (!data.menu_category_id) {
      const fetchAddCategory = async () => {
        if (!data?.shop_id) {
          Swal.fire({
            title: "請選擇店家",
            icon: "warning"
          });
          return;
        }
        if (!data?.category_name || data?.category_name?.trim() === "") {
          Swal.fire({
            title: "請填寫餐點類別名稱",
            icon: "warning"
          });
          return;
        }
        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/addCategory", data);
          if (res.status === 200) {
            Swal.fire({
              title: "新增餐點類別成功",
              icon: "success",
            });
            // 取得 category 物件
            const newCategory = res.data.category;
            // 將 is_active 轉成 true / false, 變更 menu_category_id title
            const formattedCategory = { ...newCategory, is_active: newCategory.is_active === 1, menu_category_id: newCategory.id };
            // 加入 allcategories
            setAllcategories(prev => [...prev, formattedCategory]);
            setSelectCategory(formattedCategory);
            const shop = allshops.find(s=>s.shop_id === Number(newCategory.shop_id));
            if (shop) setSelectShop({ shop_id: shop.shop_id, shop_name: shop.shop_name })
          }
        } catch (err) {
          if (err.response?.status === 400) {
            Swal.fire({
              title: "餐點類別名稱重複，請重新設定",
              icon: "error",
            });
          } else {
            console.error("新增餐點類別失敗:", err);
            Swal.fire({
              title: "新增餐點類別失敗，請稍後再試",
              icon: "error",
            });
          }
        } finally {
          closeModal();
        }
      }
      fetchAddCategory();
    } else {
      const fetchUpdateCategory = async () => {
        if (!data?.shop_id) {
          Swal.fire({
            title: "請選擇店家",
            icon: "warning"
          });
          return;
        }
        if (!data?.category_name || data?.category_name?.trim() === "") {
          Swal.fire({
            title: "請填寫餐點類別名稱",
            icon: "warning"
          });
          return;
        }

        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/updateCategory", data);
          if (res.status === 200) {
            Swal.fire({
              title: "餐點類別更新成功",
              icon: "success",
            });
            setAllcategories(prev =>
              prev.map(category =>
                category.menu_category_id === data.menu_category_id ? data : category
              )
            );
            if (selectCategory.menu_category_id === data.menu_category_id) {
              setSelectCategory(data)
            }
            
            const shop = allshops.find(s => s.shop_id === data.shop_id)
            if (shop) {
              setSelectShop({ shop_id: shop.shop_id, shop_name: shop.shop_name })
            }
          }
        } catch (err) {
          console.log("餐點類別更新失敗:", err);
          console.error("餐點類別更新失敗:", err);
          // 可以選擇加提示
          Swal.fire({
            title: "餐點類別更新失敗，請稍後再試",
            icon: "error",
          });
        } finally {
          closeModal();
        }
      }
      fetchUpdateCategory();
    }
  };
  const deleteCategory = (menu_category_id) => {
    const fetchDeleteCategory = async () => {
      closeModal();
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/deleteCategory", { menu_category_id });
        if (res.status === 200) {
          Swal.fire({
            title: "餐點類別刪除成功",
            icon: "success",
          });
          setAllcategories(prev =>
            prev.map(category =>
              category.menu_category_id === menu_category_id ? { ...category, delete_flag: 1 } : category
            )
          );
          if (selectCategory?.menu_category_id === menu_category_id) {
            setSelectCategory(null);
            setSelectFood(null);
          }
        }
      } catch (err) {
        console.error("餐點類別刪除失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "餐點類別刪除失敗，請稍後再試",
          icon: "error",
        });
      }
    }
    fetchDeleteCategory();
  };

  // FOODS
  const toggleFoodActive = async (food_id, newState) => {
    try {
      // 假設後端是 POST 更新狀態
      const res = await api.post("/api/changeIsFoodActive", { food_id: food_id, enabled: newState });
      if (res.status === 200) {
        setAllFoods(prev =>
          prev.map(food =>
            food.food_id === food_id ? { ...food, is_active: newState } : food
          )
        );
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
  const saveFood = (data) => {
    if (!data.food_id) {
      const fetchAddFood = async () => {
        if (!data?.menu_category_id) {
          Swal.fire({
            title: "請選擇餐點類別",
            icon: "warning"
          });
          return;
        }
        if (!data?.food_name || data?.food_name?.trim() === "") {
          Swal.fire({
            title: "請填寫餐點名稱",
            icon: "warning"
          });
          return;
        }
        const price = Number(data.price);
        if (isNaN(price) || price < 0 || !Number.isInteger(price)) {
          Swal.fire({
            title: "售價請輸入正整數或 0",
            icon: "warning"
          });
          return;
        }
        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/addFood", data);
          if (res.status === 200) {
            Swal.fire({
              title: "新增餐點成功",
              icon: "success",
            });
            // 取得 category 物件
            const newFood = res.data.food;
            // 將 is_active 轉成 true / false, 變更 menu_category_id title
            const formattedFood = { ...newFood, is_active: newFood.is_active === 1, food_id: newFood.id, menu_category_id: Number(newFood.menu_category_id) };
            // 加入 allcategories
            setAllFoods(prev => [...prev, formattedFood]);
            setSelectFood(formattedFood);
            const category = allcategories.find(c=>c.menu_category_id === Number(newFood.menu_category_id));
            if (category) setSelectCategory({ menu_category_id: category.menu_category_id, category_name: category.category_name })
          }
        } catch (err) {
          if (err.response?.status === 400) {
            Swal.fire({
              title: "餐點名稱重複，請重新設定",
              icon: "error",
            });
          } else {
            console.error("新增餐點失敗:", err);
            Swal.fire({
              title: "新增餐點失敗，請稍後再試",
              icon: "error",
            });
          }
        } finally {
          closeModal();
        }
      }
      fetchAddFood();
    } else {
      const fetchUpdateFood = async () => {
        const menu_category_id = Number(data?.menu_category_id);
        if (!data?.menu_category_id) {
          Swal.fire({
            title: "請選擇餐點類別",
            icon: "warning"
          });
          return;
        }
        if (!data?.food_name || data?.food_name?.trim() === "") {
          Swal.fire({
            title: "請填寫餐點名稱",
            icon: "warning"
          });
          return;
        }
        const price = Number(data.price);
        if (isNaN(price) || price < 0 || !Number.isInteger(price)) {
          Swal.fire({
            title: "售價請輸入正整數或 0",
            icon: "warning"
          });
          return;
        }
        const payload = {
          ...data,
          menu_category_id
        };
        try {
          // 假設後端是 POST 更新狀態
          const res = await api.post("/api/updateFood", payload);
          if (res.status === 200) {
            Swal.fire({
              title: "餐點更新成功",
              icon: "success",
            });
            setAllFoods(prev =>
              prev.map(food =>
                food.food_id === payload.food_id ? payload : food
              )
            );
            if (selectFood.food_id === payload.food_id) {
              setSelectFood(payload)
            }
            const category = allcategories.find(c => c.menu_category_id === payload.menu_category_id)
            if (category) {
              setSelectCategory({ menu_category_id: category.menu_category_id, category_name: category.category_name })
            }
          }
        } catch (err) {
          console.error("餐點更新失敗:", err);
          // 可以選擇加提示
          Swal.fire({
            title: "餐點更新失敗，請稍後再試",
            icon: "error",
          });
        } finally {
          closeModal();
        }
      }
      fetchUpdateFood();
    }
  };
  const deleteFood = (food_id) => {
    const fetchDeleteFood = async () => {
      closeModal();
      try {
        // 假設後端是 POST 更新狀態
        const res = await api.post("/api/deleteFood", { food_id });
        if (res.status === 200) {
          Swal.fire({
            title: "餐點刪除成功",
            icon: "success",
          });
          setAllFoods(prev =>
            prev.map(food =>
              food.food_id === food_id ? { ...food, delete_flag: 1 } : food
            )
          );
          if (selectFood?.food_id === food_id) {
            setSelectFood(null);
          }
        }
      } catch (err) {
        console.error("餐點刪除失敗:", err);
        // 可以選擇加提示
        Swal.fire({
          title: "餐點刪除失敗，請稍後再試",
          icon: "error",
        });
      }
    }
    fetchDeleteFood();
  };

  /* ─── Stats ──────────────── */
  const stats = [
    { label: "餐飲店家", value: allshops.filter(s => s.delete_flag === 0).length, icon: Store, color: "blue", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-100" },
    { label: "餐點類別", value: allcategories.filter(c => c.delete_flag === 0).length, icon: UtensilsCrossed, color: "purple", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-100" },
    { label: "餐點名稱", value: allfoods.filter(f => f.delete_flag === 0).length, icon: BookOpen, color: "orange", bg: "bg-orange-500", light: "bg-orange-50", border: "border-orange-100" },
    {
      label: "平均餐點數", value: stores.length ? (dishes.length / stores.length).toFixed(1) : 0,
      icon: ChevronRight, color: "green", bg: "bg-green-500", light: "bg-green-50", border: "border-green-100"
    },
  ];

  /* ─── Render modal content ─ */
  const renderModal = () => {
    if (!modal) return null;
    const { type, entity, data } = modal;
    /* DELETE */
    if (type === "delete") {
      const name = entity === "shops" ? data.shop_name
        : entity === "categories" ? data.category_name
          : data.food_name;
      const onConfirm = entity === "shops" ? () => deleteShop(data.shop_id)
        : entity === "categories" ? () => deleteCategory(data.menu_category_id)
          : () => deleteFood(data.food_id);
      return <DeleteModal name={name} onClose={closeModal} onConfirm={onConfirm} />;
    }

    /* STORE add/edit */
    if (entity === "shops") {
      const [form, setForm] = [data, (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }))];

      return (
        <Modal title={type === "add" ? "新增店家" : "編輯店家"}
          onClose={closeModal} onConfirm={() => saveShop(form)}
          confirmColor="bg-blue-500 hover:bg-blue-600">
          <Field label="店家名稱" required>
            <input className={inputCls} placeholder="例：老王牛肉麵" value={form.shop_name || ""} onChange={e => setForm({ shop_name: e.target.value })} />
          </Field>
          <Field label="連絡電話">
            <input className={inputCls} placeholder="例：04-2359-2181" value={form.shop_phone || ""} onChange={e => setForm({ shop_phone: e.target.value })} />
          </Field>
          <Field label="備註">
            <input className={inputCls} placeholder="例：老闆人好…" value={form.remark || ""} onChange={e => setForm({ remark: e.target.value })} />
          </Field>
        </Modal>
      );
    }

    /* categories add/edit */
    if (entity === "categories") {
      const [form, setForm] = [data, (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }))];
      return (
        <Modal
          title={type === "add" ? "新增餐點類別" : "編輯餐點類別"}
          onClose={closeModal}
          onConfirm={() =>
            saveCategory({
              ...form,
              shop_id: Number(form.shop_id), // 後端用數字
            })
          }
          confirmColor="bg-purple-500 hover:bg-purple-600"
        >
          <Field label="所屬店家" required>
            <Select
              value={form.shop_id}
              onChange={v => setForm({ shop_id: v })}
              options={allshops
                .filter(s => s.is_active && s.delete_flag === 0)
                .map(s => ({ value: s.shop_id.toString(), label: s.shop_name }))}
              placeholder="請選擇店家"
            />
          </Field>

          <Field label="樣式名稱" required>
            <input
              className={inputCls}
              placeholder="例：湯麵系列、燉飯系列…"
              value={form.category_name}
              onChange={e => setForm({ category_name: e.target.value })}
            />
          </Field>
        </Modal>
      );
    }

    /* DISH add/edit */
    if (entity === "foods") {
      const [form, setForm] = [data, (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }))];
      return (
        <Modal title={type === "add" ? "新增餐點" : "編輯餐點"}
          onClose={closeModal} onConfirm={() => saveFood({ ...form, price: Number(form.price) })}
          confirmColor="bg-orange-500 hover:bg-orange-600">
          <Field label="所屬餐點類別" required>
            <Select value={form.menu_category_id || ""} onChange={v => setForm({ menu_category_id: v })}
              options={
                selectShop?.shop_id
                  ? allcategories
                    .filter(c => c.shop_id === selectShop.shop_id)
                    .map(sc => {
                      const shop = allshops.find(s => s.shop_id === sc.shop_id);
                      return {
                        value: sc.menu_category_id,
                        label: `${shop?.shop_name ?? ""} ／ ${sc.category_name}`
                      };
                    })
                  : allcategories
                    .map(sc => {
                      const shop = allshops.find(s => s.shop_id === sc.shop_id);
                      return {
                        value: sc.menu_category_id,
                        label: `${shop?.shop_name ?? ""} ／ ${sc.category_name}`
                      };
                    })
              }
              placeholder="請選擇餐點類別"
            />
          </Field>
          <Field label="餐點名稱" required>
            <input className={inputCls} placeholder="例：紅燒牛肉麵…" value={form.food_name || ""} onChange={e => setForm({ food_name: e.target.value })} />
          </Field>
          <Field label="售價 (NT$)" required>
            <input
              className={inputCls}
              type="text"
              inputMode="numeric"
              placeholder="例：150"
              value={form.price ?? ""}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, ""); // 只允許數字
                setForm({ price: raw });
              }}
              onBlur={e => {
                const value = Number(e.target.value);
                if (isNaN(value) || value < 0) setForm({ price: 0 });
                else setForm({ price: value }); // blur 時去掉前導零
              }}
            />
          </Field>

        </Modal>
      );
    }
  };

  /* ─── Table rows ─────────── */
  const renderRows = () => {
    if (tab === "shops") return filteredShops.map((row, i) => (
      <tr key={row.shop_id}
        className={`hover:bg-slate-100 transition-colors ${selectShop?.shop_name === row.shop_name ? "bg-slate-100" : ""}`}
        onClick={() => { setSelectShop({ shop_id: row.shop_id, shop_name: row.shop_name }); setSelectCategory(null); setSelectFood(null) }}
        onDoubleClick={() => {
          setSelectShop({ shop_id: row.shop_id, shop_name: row.shop_name });
          setSelectCategory(null);
          setSelectFood(null);
          setTab("categories");
        }}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-sm font-bold text-gray-900">{row.shop_name}</span>
          </div>
        </td>
        <td className="px-6 py-4"><Badge color="orange">{row.shop_phone || "未設定"}</Badge></td>
        <td className="px-6 py-4"><Badge color="purple">{CategoryCount(row.shop_id)} 種樣式</Badge></td>
        <td className="px-6 py-4"><Badge color="rose">{row.remark}</Badge></td>
        <td className="px-6 py-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active}
              onChange={() => toggleStoreActive(row.shop_id, !row.is_active)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            <span className="ml-3 text-sm text-red-700 peer-checked:hidden">關閉</span>
            <span className="ml-3 text-sm text-green-700 hidden peer-checked:inline">啟用</span>
          </label>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <div onClick={() => setModal({ type: "edit", entity: "shops", data: { ...row } })}
              className="px-4 py-2 rounded-lg text-blue-400 hover:text-gray-200 hover:bg-blue-300 transition-all">
              <Pencil className="w-4 h-4" />
            </div>
            <div onClick={() => setModal({ type: "delete", entity: "shops", data: row })}
              className="px-4 py-2 rounded-lg text-red-400 hover:text-gray-100 hover:bg-red-200 transition-all">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
        </td>
      </tr>
    ));

    if (tab === "categories") return filteredCategories.map((row) => {
      const shop = allshops.find(s => s.shop_id === row.shop_id);
      return (
        <tr key={row.menu_category_id}
          className={`hover:bg-slate-100 transition-colors ${selectCategory?.category_name === row.category_name ? "bg-slate-100" : ""}`}
          onClick={() => { setSelectCategory({ menu_category_id: row.menu_category_id, category_name: row.category_name }); setSelectFood(null) }}
          onDoubleClick={() => {
            setSelectCategory({ menu_category_id: row.menu_category_id, category_name: row.category_name });
            setSelectFood(null);
            setTab("foods");
          }}
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-sm font-semibold text-gray-900">{row.category_name}</span>
            </div>
          </td>
          <td className="px-6 py-4 text-center">
            <Badge color="blue">{shop?.shop_name ?? <span className="text-gray-400">已刪除</span>}</Badge>
          </td>
          <td className="px-6 py-4 text-center"><Badge color="orange">{foodCount(row.menu_category_id)} 道餐點</Badge></td>
          <td className="px-6 py-4 text-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={row.is_active}
                onChange={() => toggleCategoryActive(row.menu_category_id, !row.is_active)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              <span className="ml-3 text-sm text-red-700 peer-checked:hidden">關閉</span>
              <span className="ml-3 text-sm text-green-700 hidden peer-checked:inline">啟用</span>
            </label>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <div onClick={() => setModal({ type: "edit", entity: "categories", data: { ...row } })}
                className="px-4 py-2 rounded-lg text-blue-400 hover:text-gray-200 hover:bg-blue-300 transition-all">
                <Pencil className="w-4 h-4" />
              </div>
              <div onClick={() => setModal({ type: "delete", entity: "categories", data: row })}
                className="px-4 py-2 rounded-lg text-red-400 hover:text-gray-100 hover:bg-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
          </td>
        </tr>
      );
    });

    if (tab === "foods") return filteredFoods.map((row) => {
      const category = allcategories.find(s => s.menu_category_id === row.menu_category_id);
      const store = allshops.find(s => s.shop_id === category?.shop_id);
      return (
        <tr key={row.food_id}
          className={`hover:bg-slate-100 transition-colors ${selectFood?.food_name === row.food_name ? "bg-slate-100" : ""}`}
          onClick={() => setSelectFood({ food_id: row.food_id, food_name: row.food_name, type: "edit", entity: "foods", data: { ...row } })}
          onDoubleClick={() => { setSelectFood({ food_id: row.food_id, food_name: row.food_name, type: "edit", entity: "foods", data: { ...row } }); setModal({ type: "edit", entity: "foods", data: { ...row } }) }}
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              <span className="text-sm font-semibold text-gray-900">{row.food_name}</span>
            </div>
          </td>
          <td className="px-6 py-4 text-center"><Badge color="blue">{store?.shop_name ?? "—"}</Badge></td>
          <td className="px-6 py-4"><Badge color="purple">{category?.category_name ?? "—"}</Badge></td>
          <td className="px-6 py-4 text-center">
            <span className="text-sm font-bold text-orange-600">NT$ {row.price}</span>
          </td>
          <td className="px-6 py-4 text-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={row.is_active}
                onChange={() => toggleFoodActive(row.food_id, !row.is_active)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              <span className="ml-3 text-sm text-red-700 peer-checked:hidden">關閉</span>
              <span className="ml-3 text-sm text-green-700 hidden peer-checked:inline">啟用</span>
            </label>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <div onClick={() => setModal({ type: "edit", entity: "foods", data: { ...row } })}
                className="px-4 py-2 rounded-lg text-blue-400 hover:text-gray-200 hover:bg-blue-300 transition-all">
                <Pencil className="w-4 h-4" />
              </div>
              <div onClick={() => setModal({ type: "delete", entity: "foods", data: row })}
                className="px-4 py-2 rounded-lg text-red-400 hover:text-gray-100 hover:bg-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  /* ─── Table headers ──────── */
  const headers = {
    shops: ["店家名稱", "連絡電話", "餐點類別數", "備註", "狀態", "操作"],
    categories: ["樣式名稱", "所屬店家", "餐點數", "狀態", "操作"],
    foods: ["餐點名稱", "店家", "樣式", "售價", "狀態", "操作"],
  };

  useEffect(() => {
    const fetchGetAllShops = async () => {
      try {
        const res = await api.get('/api/getAllShops');
        if (res.status === 200) {
          const selectshops = res.data.AllShops.map(s => ({ ...s, is_active: s.is_active === 1 ? true : false }));
          setAllshops(selectshops);
        }
      } catch (error) {
        console.log("fetchGetAllShops error:", error);
      }
    }
    fetchGetAllShops();
    const fetchGetAllcategories = async () => {
      try {
        const res = await api.get('/api/GetAllcategories');
        if (res.status === 200) {
          const selectcategories = res.data.Allcategories.map(s => ({ ...s, is_active: s.is_active === 1 ? true : false }));
          setAllcategories(selectcategories);
        }
      } catch (error) {
        console.log("GetAllcategories error:", error);
      }
    }
    fetchGetAllcategories();
    const fetchGetAllfoods = async () => {
      try {
        const res = await api.get('/api/GetAllfoods');
        if (res.status === 200) {
          const selectfoods = res.data.Allfoods.map(s => ({ ...s, is_active: s.is_active === 1 ? true : false }));
          setAllFoods(selectfoods);
        }
      } catch (error) {
        console.log("GetAllfoods error:", error);
      }
    }
    fetchGetAllfoods();
  }, [])

  return (
    <div className="px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.light} to-white rounded-xl border ${s.border} p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${s.bg} rounded-lg shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex text-2xl font-bold text-slate-900">
              {s.label === "餐點類別" &&
                <div className="mx-2">
                  {CategoryCount(selectShop?.shop_id)} /
                </div>
              }
              {s.label === "餐點名稱" &&
                <div className="mx-2">
                  {foodCount(selectCategory?.menu_category_id)} /
                </div>
              }
              {s.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tab + Search + Add ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map(t => (
              <div key={t.key} onClick={() => { setTab(t.key); setSearch(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t.key ? `${t.bg} text-white shadow-sm` : "text-gray-500 hover:text-gray-700"}`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`搜尋${activeTab.label}…`}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all" />
          </div>

          {/* Add div */}
          <div
            onClick={() => {
              if (tab === "shops") {
                setModal({
                  type: "add",
                  entity: "shops",
                  data: {}
                });
              }
              if (tab === "categories") {
                setModal({
                  type: "add",
                  entity: "categories",
                  data: {
                    shop_id: selectShop?.shop_id?.toString() ?? "",
                    category_name: ""
                  }
                });
              }
              if (tab === "foods") {
                setModal({
                  type: "add",
                  entity: "foods",
                  data: {
                    menu_category_id: selectCategory?.menu_category_id?.toString() ?? "",
                    food_name: ""
                  }
                });
              }

            }}
            className={`flex items-center gap-1.5 px-4 py-2 ${activeTab.bg} text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-sm flex-shrink-0`}>
            <Plus className="w-4 h-4" />
            新增{activeTab.label}
          </div>
        </div>
        <div className="w-full flex p-3">
          <>
            <div className={`px-3 py-1 rounded-md cursor-pointer hover:font-bold hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-300
                ${tab === "shops" && selectShop?.shop_name ? "underline underline-offset-4 text-[rgb(42,42,255)] font-bold" : "text-gray-500"} ${tab === "shops" ? "underline underline-offset-4" : "" }
              `}
              onClick={() => setTab("shops")}
            >
              {selectShop?.shop_name ?? "店家"}
            </div>
            {(selectShop?.shop_name || selectCategory?.category_name || tab !== "shops") &&
              <>
                <span className="flex items-center justify-center">{">"}</span>
                <div className={`px-3 py-1 rounded-md cursor-pointer hover:font-bold hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-300
                  ${tab === "categories" && selectCategory?.category_name ? "underline underline-offset-4 text-[rgb(42,42,255)] font-bold" : "text-gray-500"} ${tab === "categories" ? "underline underline-offset-4" : ""}
                `}
                  onClick={() => setTab("categories")}
                >
                  {selectCategory?.category_name ?? "餐點類別"}
                </div>
              </>
            }
            {(selectCategory?.category_name || selectFood?.food_name || tab === "foods") &&
              <>
                <span className="flex items-center justify-center">{">"}</span>
                <div className={`px-3 py-1 rounded-md cursor-pointer hover:font-bold hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-300
                  ${tab === "foods" && selectFood?.food_name ? "underline underline-offset-4 text-[rgb(42,42,255)] font-bold" : "text-gray-500"} ${tab === "foods" ? "underline underline-offset-4" : ""}
                `}
                  onClick={() => { setTab("foods"); if (selectFood?.food_name) setModal({ type: selectFood?.type, entity: selectFood?.entity, data: selectFood?.data }) }}
                >
                  {selectFood?.food_name ?? "餐點"}
                </div>
              </>
            }
            {selectShop?.shop_name &&
              <div className={`flex items-center ml-auto mr-3 gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-700 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-sm flex-shrink-0`}
                onClick={() => setShowMenu(true)}
              >
                <div>預覽菜單</div>
              </div>
            }

          </>
        </div>
        {(tab === "categories" || tab === "foods") && allshops.find(s => s.shop_id === selectShop?.shop_id && s.is_active === false) &&
          <div className="w-full flex mb-2 p-3 py-0">
            <span className="text-red-500 px-3">注意：店家［ {selectShop?.shop_name} ］　狀態已經關閉，請留意編輯</span>
          </div>
        }
        {(tab === "foods") && allcategories.find(c => c.menu_category_id === selectCategory?.menu_category_id && c.is_active === false) &&
          <div className="w-full flex mb-2 p-3 py-0">
            <span className="text-red-500 px-3">注意：餐點類別［ {selectCategory?.category_name} ］　狀態已經關閉，請留意編輯</span>
          </div>
        }

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                {headers[tab].map((h, i) => (
                  <th key={i} className={`px-6 py-3 text-xs font-semibold text-center text-gray-600 `}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {renderRows()}
            </tbody>
          </table>
          {(tab === "shops" ? filteredShops : tab === "categories" ? filteredCategories : filteredFoods).length === 0 && (
            <div className="text-center py-14 text-gray-400">
              <p className="text-3xl mb-2">🍽️</p>
              <p className="text-sm font-medium">目前沒有{activeTab.label}</p>
            </div>
          )}
        </div>

        {/* Footer count */}
        <div className="px-6 py-3 border-t border-gray-100 bg-slate-50">
          <p className="text-xs text-gray-400">
            顯示 {(tab === "shops" ? filteredShops : tab === "categories" ? filteredCategories : filteredFoods).length} 筆資料
          </p>
        </div>
      </div>

      {/* Modal */}
      {renderModal()}

      {/* Food Menu */}
      {showMenu && (() => {
        const currentShop = allshops.find(s => s.shop_id === selectShop?.shop_id);
        const shopInactive = !currentShop?.is_active;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMenu(false)}>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-[85vw] max-h-[85vh] overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>

              {/* 標題區 */}
              <div className="bg-gradient-to-r from-blue-400 to-green-400 px-6 py-5 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-white/70 text-xs font-medium tracking-wide">MENU</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-white text-xl font-bold">{selectShop?.shop_name}</h2>
                    {shopInactive && (
                      <span className="filter-none text-xs font-bold bg-white text-red-500 px-2 py-0.5 rounded-full">今日停售</span>
                    )}
                  </div>
                </div>
                <div onClick={() => setShowMenu(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer">✕</div>
              </div>

              {/* 內容區 */}
              <div className={`overflow-y-auto p-6 flex flex-col gap-5  ${shopInactive ? "grayscale opacity-90" : ""}`}>
                {filteredCategories
                  .filter(c => c.shop_id === selectShop?.shop_id)
                  .map((category, idx) => {
                    const colors = [
                      { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-600", tag: "bg-purple-100 text-purple-600" },
                      { bg: "bg-pink-50", border: "border-pink-200", title: "text-pink-600", tag: "bg-pink-100 text-pink-600" },
                      { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-600", tag: "bg-blue-100 text-blue-600" },
                      { bg: "bg-green-50", border: "border-green-200", title: "text-green-600", tag: "bg-green-100 text-green-600" },
                      { bg: "bg-orange-50", border: "border-orange-200", title: "text-orange-600", tag: "bg-orange-100 text-orange-600" },
                    ];
                    const c = colors[idx % colors.length];
                    const categoryFoods = allfoods.filter(f => f.menu_category_id === category.menu_category_id && f.delete_flag === 0);
                    const categoryInactive = !category.is_active;

                    return (
                      <div key={category.menu_category_id} className={`rounded-2xl p-4 border transition-all ${categoryInactive ? "bg-gray-100 border-gray-200 grayscale opacity-60" : `${c.bg} ${c.border}`}`}>
                        {/* 類別標題 */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryInactive ? "bg-gray-200 text-gray-500" : c.tag}`}>
                            {categoryFoods.length} 項
                          </span>
                          <h3 className={`font-bold text-base ${categoryInactive ? "text-gray-400" : c.title}`}>{category.category_name}</h3>
                          {categoryInactive && (
                            <span className="text-xs font-bold bg-gray-300 text-gray-500 px-2 py-0.5 rounded-full ml-auto">今日停售</span>
                          )}
                        </div>

                        {/* 餐點列表 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                          {categoryFoods.map(food => {
                            const foodInactive = !food.is_active;
                            return (
                              <div key={food.food_id} className={`flex justify-between items-center rounded-xl px-4 py-2.5 shadow-sm transition-all ${foodInactive ? "bg-gray-100 grayscale opacity-60" : "bg-white"}`}>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-sm font-medium ${foodInactive ? "text-gray-400" : "text-gray-700"}`}>{food.food_name}</span>
                                  {foodInactive && (
                                    <span className="text-xs font-bold bg-gray-300 text-gray-500 px-1.5 py-0.5 rounded-full">今日停售</span>
                                  )}
                                </div>
                                <span className={`text-sm font-bold ${shopInactive || categoryInactive || foodInactive ? "text-gray-400 line-through" : c.title}`}>NT$ {food.price}</span>
                              </div>
                            );
                          })}
                          {categoryFoods.length === 0 && (
                            <p className="text-xs text-gray-400 col-span-3 text-center py-2">尚無餐點</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                }
              </div>

            </div>
          </div>
        )
      })()}
    </div >
  );
}
