import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";

function Stars({ rating }) {
  const r = Number(rating) || 0;
  return <div className="text-yellow-600">{"★".repeat(r)}{"☆".repeat(5 - r)}</div>;
}

export default function ShopReviewDetail() {
  const { shopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("shop"); // shop | food
  const [shopReviews, setShopReviews] = useState([]);
  const [foodReviews, setFoodReviews] = useState([]);

  const shopName = useMemo(() => {
    const fromShop = shopReviews?.[0]?.shop_name;
    const fromFood = foodReviews?.[0]?.shop_name;
    return fromShop || fromFood || `店家 #${shopId}`;
  }, [shopReviews, foodReviews, shopId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [a, b] = await Promise.all([
          api.get("/api/reviews", { params: { shop_id: shopId, type: "shop" } }),
          api.get("/api/reviews", { params: { shop_id: shopId, type: "food" } }),
        ]);
        setShopReviews(a.data?.data ?? []);
        setFoodReviews(b.data?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [shopId]);

  if (loading) return <div className="p-6">載入中...</div>;

  const list = tab === "shop" ? shopReviews : foodReviews;

  return (
    <div className="p-6 space-y-4">
      <div>
        <div className="text-sm text-gray-500">店家頁</div>
        <h1 className="text-xl font-bold">{shopName}</h1>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-3 py-2 rounded-lg border ${tab === "shop" ? "bg-black text-white" : "bg-white"}`}
          onClick={() => setTab("shop")}
        >
          店家評價（{shopReviews.length}）
        </button>
        <button
          className={`px-3 py-2 rounded-lg border ${tab === "food" ? "bg-black text-white" : "bg-white"}`}
          onClick={() => setTab("food")}
        >
          餐點評價（{foodReviews.length}）
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-gray-500">目前尚無評論</div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.review_id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="font-semibold text-gray-800">
                  {tab === "food" ? (r.food_name ?? `food#${r.food_id}`) : (r.user_name ?? `User#${r.user_id}`)}
                </div>
                <Stars rating={r.rating} />
              </div>

              <div className="mt-2 text-sm text-gray-600">{r.comment ?? ""}</div>

              {tab === "food" && (
                <div className="mt-2 text-xs text-gray-400">
                  by {r.user_name ?? `User#${r.user_id}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}