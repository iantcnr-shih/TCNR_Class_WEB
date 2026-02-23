// 簡單記憶體資料庫（重整會清空）
let _db = [];

/** 給「可評論店家/餐點」推導用（shop_id/food_id/shop_name/food_name） */
const ORDER_ITEMS = [
  { shop_id: 1, shop_name: "八方雲集", food_id: 101, food_name: "鍋貼" },
  { shop_id: 1, shop_name: "八方雲集", food_id: 102, food_name: "酸辣湯" },
  { shop_id: 2, shop_name: "米撰雞腿壩王", food_id: 201, food_name: "雞腿飯" },
  { shop_id: 2, shop_name: "米撰雞腿壩王", food_id: 202, food_name: "排骨飯" },
  { shop_id: 3, shop_name: "五棧燒鵝", food_id: 301, food_name: "燒鵝飯" },
];

function getSeedShopId() {
  return ORDER_ITEMS[0]?.shop_id ?? 1;
}

/**
 * 初始化一筆預設評論（只在第一次、且 db 為空時）
 * - seed 的 shop_id 一律跟 ORDER_ITEMS 第一筆一致
 */
function ensureSeed({ food_id = null } = {}) {
  if (_db.length > 0) return;

  const seedShopId = getSeedShopId();

  _db = [
    {
      review_id: 1,
      shop_id: seedShopId,
      food_id,
      user_id: 2,
      rating: 5,
      comment: "很好吃",
      created_at: "2026-02-15 21:00:00",
      user_name: "Tako",
      food_name: null,
      shop_name: null,
    },
  ];
}

/**
 * ✅ 新介面：一次拿全部 reviews（給 MealOrder 啟動時用）
 */
export function getReviewsMock() {
  ensureSeed({ food_id: null });
  return Promise.resolve([..._db]);
}

/**
 * ✅ 新介面：新增評論（給 MealOrder.handleAddReview 用）
 */
export function addReviewMock(payload) {
  if (!payload?.shop_id) {
    return Promise.reject(new Error("shop_id is required"));
  }

  const shop_id = Number(payload.shop_id);
  const food_id = payload.food_id == null ? null : Number(payload.food_id);

  const newReview = {
    review_id: Date.now(),
    shop_id,
    food_id,
    user_id: payload.user_id ?? 2,
    rating: Number(payload.rating ?? 5),
    comment: payload.comment ?? "",
    created_at: new Date().toISOString(),
    user_name: "Tako",
    food_name: null,
    shop_name: null,
    seat_number: payload.seat_number ?? null,
  };

  _db = [newReview, ..._db];
  return Promise.resolve(newReview);
}

/**
 * ✅ 新介面：回傳 history tab + 評論可選店家/餐點所需的 orderItems
 */
export function getOrderHistoryMock() {
  const history = [
    {
      date: "2026-02-19",
      item: "雞腿飯 + 紅茶",
      amount: 115,
      status: "已完成",
    },
    {
      date: "2026-02-18",
      item: "排骨飯 + 綠茶",
      amount: 105,
      status: "已完成",
    },
    {
      date: "2026-02-17",
      item: "素食便當 + 豆漿",
      amount: 105,
      status: "已完成",
    },
    {
      date: "2026-02-14",
      item: "牛肉麵 + 咖啡",
      amount: 145,
      status: "已取消",
    },
  ];

  return Promise.resolve({ history, orderItems: ORDER_ITEMS });
}

/* ------------------------------------------------------------------ */
/* 舊介面保留（避免其他地方還在用時壞掉），但內部改呼叫新介面            */
/* ------------------------------------------------------------------ */

export function getReviews(shopId) {
  // seed shop_id 仍以 ORDER_ITEMS 第一筆為準
  ensureSeed({ food_id: null });
  return Promise.resolve(
    _db.filter((r) => String(r.shop_id) === String(shopId)),
  );
}

export function createReview(shopId, payload) {
  return addReviewMock({
    ...payload,
    shop_id: shopId,
    food_id: payload?.food_id ?? null,
  });
}
