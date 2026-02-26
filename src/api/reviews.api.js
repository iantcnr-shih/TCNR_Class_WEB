// /src/api/reviews.api.js
import api from "@/api/axios";

export async function getReviewsApi({ shop_id, food_id = null }) {
  const params = { shop_id };

  // 後端：food_id = 'null' / '' / null → whereNull
  if (food_id == null) params.food_id = "null";
  else params.food_id = food_id;

  const res = await api.get("/api/reviews", { params });
  return res.data.data; // { data: [...] }
}

export async function addReviewApi(payload) {
  const res = await api.post("/api/reviews", {
    shop_id: payload.shop_id,
    food_id: payload.food_id ?? null,
    user_id: payload.user_id,
    rating: payload.rating,
    comment: payload.comment ?? null,
  });
  return res.data.data; // { data: {...} }
}
