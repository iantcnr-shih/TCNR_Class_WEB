import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function ShopReviewSummary() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/review-summary");
        setShops(res.data?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">載入中...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">店家評論總表</h1>

      {shops.length === 0 ? (
        <div className="text-gray-500">目前沒有店家資料</div>
      ) : (
        <div className="space-y-3">
          {shops.map((s) => (
            <button
              key={s.shop_id}
              className="w-full text-left bg-white border rounded-xl p-4 hover:bg-gray-50"
              onClick={() => navigate(`/reviews/shops/${s.shop_id}`)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{s.shop_name}</div>
                <div className="text-sm text-gray-600">
                  平均 {s.avg_rating_all ?? "-"}（{s.review_count_all ?? 0}）
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500 flex gap-3 flex-wrap">
                <span>店家：{s.avg_shop_rating ?? "-"}（{s.shop_review_count ?? 0}）</span>
                <span>餐點：{s.avg_food_rating ?? "-"}（{s.food_review_count ?? 0}）</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}