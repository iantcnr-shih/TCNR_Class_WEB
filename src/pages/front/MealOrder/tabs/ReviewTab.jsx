import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import ReviewSection from "@/components/reviews/ReviewSection";

const Stars = ({ rating }) => {
  const r0 = Number(rating);
  const r = Number.isFinite(r0) ? Math.max(0, Math.min(5, r0)) : 0;
  const full = Math.floor(r);
  return (
    <span className="text-amber-400 font-bold text-sm">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
      <span className="text-gray-500 ml-1">{r}</span>
    </span>
  );
};

export default function ReviewTab({ seatNumber = null }) {
  // 類型：店家 / 餐點
  const [reviewTarget, setReviewTarget] = useState("shop"); // shop | food

  // 先選店家（置頂）
  const [reviewShopId, setReviewShopId] = useState("");

  // 餐點評價用：類別 -> 餐點
  const [reviewCategories, setReviewCategories] = useState([]);
  const [reviewCategoryId, setReviewCategoryId] = useState("");
  const [reviewFoods, setReviewFoods] = useState([]);
  const [reviewFoodId, setReviewFoodId] = useState("");

  // 店家清單（全店）
  const [shopsSummary, setShopsSummary] = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);

  // 右側列表：店家評論 / 餐點評論
  const [shopReviews, setShopReviews] = useState([]);
  const [foodReviews, setFoodReviews] = useState([]);
  const [activeListTab, setActiveListTab] = useState("shop"); // shop | food
  const [loadingReviews, setLoadingReviews] = useState(false);

  // 1) 初始載入：店家總表（全店）
  useEffect(() => {
    (async () => {
      setLoadingShops(true);
      try {
        const res = await api.get("/api/review-summary");
        setShopsSummary(res.data?.data ?? []);
      } catch (e) {
        console.error("load /api/review-summary failed:", e);
        setShopsSummary([]);
      } finally {
        setLoadingShops(false);
      }
    })();
  }, []);

  // 2) 選到店家：載入 categories（給餐點評價用）
  useEffect(() => {
    if (!reviewShopId) {
      setReviewCategories([]);
      setReviewCategoryId("");
      setReviewFoods([]);
      setReviewFoodId("");
      setShopReviews([]);
      setFoodReviews([]);
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/getCategories", { params: { shop_id: reviewShopId } });
        setReviewCategories(res.data?.categories ?? []);
        setReviewCategoryId("");
        setReviewFoods([]);
        setReviewFoodId("");
      } catch (e) {
        console.error("load /api/getCategories failed:", e);
        setReviewCategories([]);
      }
    })();
  }, [reviewShopId]);

  // 3) 選到類別：載入 foods
  useEffect(() => {
    if (!reviewCategoryId) {
      setReviewFoods([]);
      setReviewFoodId("");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/getFoods", { params: { menu_category_id: reviewCategoryId } });
        setReviewFoods(res.data?.foods ?? []);
        setReviewFoodId("");
      } catch (e) {
        console.error("load /api/getFoods failed:", e);
        setReviewFoods([]);
      }
    })();
  }, [reviewCategoryId]);

  // 4) 選到店家：載入右側兩份評論
  useEffect(() => {
    if (!reviewShopId) return;

    (async () => {
      setLoadingReviews(true);
      try {
        const [a, b] = await Promise.all([
          api.get("/api/reviews", { params: { shop_id: reviewShopId, type: "shop" } }),
          api.get("/api/reviews", { params: { shop_id: reviewShopId, type: "food" } }),
        ]);
        setShopReviews(a.data?.data ?? []);
        setFoodReviews(b.data?.data ?? []);
      } catch (e) {
        console.error("load /api/reviews failed:", e);
        setShopReviews([]);
        setFoodReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    })();
  }, [reviewShopId]);

  // 顯示用：目前右側要呈現哪個列表
  const listToShow = useMemo(() => {
    return activeListTab === "shop" ? shopReviews : foodReviews;
  }, [activeListTab, shopReviews, foodReviews]);

  // 5) 新增評論
  const handleAddReview = async (payload) => {
    if (!payload?.shop_id) return alert("請先選擇店家");

    const normalized = {
      ...payload,
      target: payload?.target ?? (payload?.food_id != null ? "food" : "shop"),
      shop_id: Number(payload.shop_id),
      food_id: payload.food_id == null ? null : Number(payload.food_id),
      seat_number: payload.seat_number ?? seatNumber,
    };

    if (normalized.target === "food" && !normalized.food_id) return alert("請選擇餐點");
    if (normalized.target === "shop") normalized.food_id = null;

    try {
      const res = await api.post("/api/reviews", normalized);
      const created = res.data?.data;
      if (!created) throw new Error("API response missing data");

      if (created.food_id == null) {
        setShopReviews((prev) => [created, ...prev]);
        setActiveListTab("shop");
      } else {
        setFoodReviews((prev) => [created, ...prev]);
        setActiveListTab("food");
      }

      alert("新增評論成功");
    } catch (e) {
      console.error(e);
      alert("新增評論失敗");
    }
  };

  return (
    <div className="max-w-6xl">
      {/* 置頂：選擇店家 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-4">
        <div className="font-bold text-gray-800 mb-2">餐點評價</div>
        <div className="text-xs text-gray-500 mb-1">選擇店家（全店）</div>
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
          value={reviewShopId}
          onChange={(e) => {
            const nextShopId = e.target.value;
            setReviewShopId(nextShopId);

            // 重置一些 UI 狀態（避免店家切換殘留）
            setReviewTarget("shop");
            setActiveListTab("shop");
            setReviewFoodId("");
          }}
          disabled={loadingShops}
        >
          <option value="">{loadingShops ? "載入店家中..." : "請選擇店家"}</option>
          {shopsSummary.map((s) => (
            <option key={s.shop_id} value={s.shop_id}>
              {s.shop_name}
            </option>
          ))}
        </select>

        {!reviewShopId && (
          <div className="mt-3 text-red-600 font-semibold">請先選擇店家</div>
        )}
      </div>

      {/* 選到店家後：直接顯示 新增 + 列表 */}
      {reviewShopId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左：新增 */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="font-bold text-gray-800 mb-3">新增評價</div>

            {/* 類型按鈕：套用 tako.css */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                className={`btn-review px-3 py-1 rounded-full border ${reviewTarget === "shop" ? "btn-review--active" : ""}`}
                onClick={() => {
                  setReviewTarget("shop");
                  setReviewFoodId("");
                }}
              >
                店家評價
              </button>
              <button
                type="button"
                className={`btn-review px-3 py-1 rounded-full border ${reviewTarget === "food" ? "btn-review--active" : ""}`}
                onClick={() => setReviewTarget("food")}
              >
                餐點評價
              </button>
            </div>

            {/* 餐點評價：類別 + 餐點 */}
            {reviewTarget === "food" && (
              <>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">餐點類別</div>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                    value={reviewCategoryId}
                    onChange={(e) => setReviewCategoryId(e.target.value)}
                  >
                    <option value="">請選擇類別</option>
                    {reviewCategories.map((c) => (
                      <option key={c.menu_category_id} value={c.menu_category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">餐點</div>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                    value={reviewFoodId}
                    onChange={(e) => setReviewFoodId(e.target.value)}
                    disabled={!reviewCategoryId}
                  >
                    <option value="">{reviewCategoryId ? "請選擇餐點" : "請先選類別"}</option>
                    {reviewFoods.map((f) => (
                      <option key={f.food_id} value={f.food_id}>
                        {f.food_name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <ReviewSection
              shopId={Number(reviewShopId)}
              foodId={reviewTarget === "food" && reviewFoodId ? Number(reviewFoodId) : null}
              seatNumber={seatNumber}
              reviews={[]} // 左邊不顯示列表
              showList={false}
              onAddReview={handleAddReview}
            />
          </section>

          {/* 右：列表 */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="font-bold text-gray-800">既有評價</div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn-review px-3 py-1 rounded-lg border ${activeListTab === "shop" ? "btn-review--active" : ""}`}
                  onClick={() => setActiveListTab("shop")}
                >
                  店家評價（{shopReviews.length}）
                </button>
                <button
                  type="button"
                  className={`btn-review px-3 py-1 rounded-lg border ${activeListTab === "food" ? "btn-review--active" : ""}`}
                  onClick={() => setActiveListTab("food")}
                >
                  餐點評價（{foodReviews.length}）
                </button>
              </div>
            </div>

            {loadingReviews ? (
              <div className="text-gray-500 mt-4">載入評論中...</div>
            ) : (
              <div className="mt-4 space-y-3">
                {listToShow.length === 0 ? (
                  <div className="text-gray-400">目前尚無評論</div>
                ) : (
                  listToShow.map((r) => (
                    <div key={r.review_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                        <span className="font-bold text-gray-800">
                          {activeListTab === "food"
                            ? (r.food_name ?? `food#${r.food_id}`)
                            : (r.user_name ?? `User#${r.user_id}`)}
                        </span>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                      {activeListTab === "food" && (
                        <div className="text-xs text-gray-400 mt-2">
                          by {r.user_name ?? `User#${r.user_id}`}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}