// 簡單記憶體資料庫（重整會清空）
let _db = []; 


export function getReviews(shopId) {
// 第一次如果沒資料，就先給一筆預設示範
if (_db.length === 0){
  _db = [
    {
      review_id: 1,
      shop_id: shopId,
      food_id: null,
      user_id: 2,
      rating: 5,
      comment: "很好吃",
      created_at: "2026-02-15 21:00:00",
      user_name: "Tako",
      food_name: null,
    },
  ];
}

return Promise.resolve(_db.filter((r) => r.shop_id === shopId)); 
}

export function createReview(shopId, payload) {
  const newReview = {
    review_id: Date.now(),
    shop_id: shopId,
    food_id: payload.food_id ?? null,
    user_id: payload.user_id,
    rating: payload.rating,
    comment: payload.comment ?? "",
    created_at: new Date().toISOString(),
    // UI 顯示用（先暫時寫死，之後改成登入的使用者
    user_name: "Tako",
    food_name: null,
  };

  _db = [newReview, ..._db];
  return Promise.resolve(newReview);
}


