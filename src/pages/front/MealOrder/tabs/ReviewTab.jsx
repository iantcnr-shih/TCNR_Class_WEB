import { useEffect, useMemo, useState } from "react";
import ReviewSection from "@/components/reviews/ReviewSection";
import Swal from "sweetalert2";
import api from "@/api/axios";

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

  const [openAddReview, setOpenAddReview] = useState(false);

  // 1) 初始載入：店家總表（全店）
  useEffect(() => {
    (async () => {
      setLoadingShops(true);
      try {
        const res = await api.get("/api/review-summary");
        setShopsSummary(res.data?.data ?? []);
        setReviewShopId(res.data?.data[0]?.shop_id ?? "");
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
    if (!reviewShopId) {
      setReviewCategories([]);
      setReviewCategoryId("");
      setReviewFoods([]);
      setReviewFoodId("");
      setShopReviews([]);
      setFoodReviews([]);
      return;
    }

    const loadData = async () => {
      try {
        setLoadingReviews(true);

        const [categoriesRes, shopReviewRes, foodReviewRes] = await Promise.all([
          api.get("/api/getCategories", { params: { shop_id: reviewShopId } }),
          api.get("/api/reviews", { params: { shop_id: reviewShopId, type: "shop" } }),
          api.get("/api/reviews", { params: { shop_id: reviewShopId, type: "food" } }),
        ]);

        // categories
        setReviewCategories(categoriesRes.data?.categories ?? []);
        setReviewCategoryId("");
        setReviewFoods([]);
        setReviewFoodId("");

        // reviews
        setShopReviews(shopReviewRes.data?.data ?? []);
        setFoodReviews(foodReviewRes.data?.data ?? []);

      } catch (e) {
        console.error("load shop data failed:", e);
        setReviewCategories([]);
        setShopReviews([]);
        setFoodReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadData();
  }, [reviewShopId]);

  // 顯示用：目前右側要呈現哪個列表
  const listToShow = useMemo(() => {
    return activeListTab === "shop" ? shopReviews : foodReviews;
  }, [activeListTab, shopReviews, foodReviews]);

  // 5) 新增評論
  const handleAddReview = async (payload) => {
    if (!payload?.shop_id) return Swal.fire({ title: "請先選擇店家", icon: "warning", });

    const normalized = {
      ...payload,
      target: payload?.target ?? (payload?.food_id != null ? "food" : "shop"),
      shop_id: Number(payload.shop_id),
      food_id: payload.food_id == null ? null : Number(payload.food_id),
      seat_number: payload.seat_number ?? seatNumber,
    };

    if (normalized.target === "food" && !normalized.food_id) return Swal.fire({ title: "請選擇餐點", icon: "warning", });
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
      Swal.fire({ title: "新增評論成功", icon: "success", });
    } catch (e) {
      if (e?.response?.status === 409) {
        if (normalized.target === "shop") {
          Swal.fire({
            title: "該店家您已評論過，感謝您!",
            icon: "error",
          });
        } else if (normalized.target === "food") {
          Swal.fire({
            title: "該餐點您已評論過，感謝您!",
            icon: "error",
          });
        }
      } else {
        console.error(e);
        Swal.fire({
          title: "新增評論失敗",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="max-w-6xl">
      {/* 置頂：選擇店家 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-4">
        <div className="font-bold text-gray-800 mb-2">餐點評價</div>
        <div className="text-xs text-gray-500 mb-1">選擇店家（全店）</div>
        <div className="flex flex-wrap w-full gap-3">
          {shopsSummary.map((s) => (
            <button
              key={s.shop_id}
              className={`btn-review 
                          px-4 py-2 rounded-full text-sm font-medium
                          cursor-pointer select-none
                          transition-all duration-200
                          border
                          ${reviewShopId === s.shop_id
                  ? "bg-green-500 text-white border-blue-500 shadow-md scale-105 btn-review--active"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow"
                }
                        `}
              onClick={() => {
                const nextShopId = s.shop_id;
                setReviewShopId(nextShopId);

                // 重置 UI 狀態
                setReviewTarget("shop");
                setActiveListTab("shop");
                setReviewFoodId("");
              }}
            >
              {s.shop_name}
            </button>
          ))}
        </div>

        {!reviewShopId && (
          <div className="mt-3 text-red-600 font-semibold">請先選擇店家</div>
        )}
      </div>

      {/* 選到店家後：直接顯示 新增 + 列表 */}
      {reviewShopId && (
        <div className="gap-4">

          {/* 評價列表 */}
          <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
            {/* 新增 */}
            <div className="p-3 bg-[rgb(236,243,254)]">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setOpenAddReview(!openAddReview)}
              > <div className="p-2text-gray-500 text-sm">
                  {openAddReview ? "－" : "＋"}
                </div>
                <div className="font-bold text-gray-800">新增評價</div>

              </div>

              {/* 內容 */}
              {openAddReview && (
                <div className="mt-4">

                  {/* 類型按鈕 */}
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

                  {/* 餐點評價 */}
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
                          <option value="">
                            {reviewCategoryId ? "請選擇餐點" : "請先選類別"}
                          </option>
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
                    reviews={[]}
                    showList={false}
                    onAddReview={handleAddReview}
                  />

                </div>
              )}
            </div>
            {/* 標題 + 開關 */}

            <hr className="my-5 border-gray-300" />
            <div className="flex items-center justify-between mt-5 gap-3 flex-wrap">
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
                            : (r.user_en_name || r.user_nick_name || `座號${r.seat_number}號` || "")}
                        </span>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                      {activeListTab === "food" && (
                        <div className="flex w-full">
                          <div className="ml-auto text-xs text-gray-400 mt-2">
                            by {r.user_en_name || r.user_nick_name || `座號${r.seat_number}號` || ""}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}