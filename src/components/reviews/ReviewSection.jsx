import React, { useMemo } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function ReviewSection ({
    shopId,
    foodId = null,
    seatNumber = null,
    reviews = [],
    onAddReview,
}) {
    const scopedReviews = useMemo(() => {
        return reviews.filter((r) => {
            const sameShop = String(r.shop_id) === String(shopId);
            const sameFood = 
            foodId === null ? r.food_id == null : String(r.food_id) === String(foodId);
            return sameShop && sameFood; 
        });
    }, [reviews, shopId, foodId]);

    const handleSubmit = async (formData) => {
        // formData 由 ReviewForm 提供（例如 rating/comment）
        // 這裡補齊必要欄位，交給 MealOrder.handleAddReview 去呼叫 mock + 更新全域 reviews
        const payload = {
            ...formData,
            shop_id: shopId,
            food_id: foodId,
            // 店家評論會是 null；餐點評論是 number
            // target 可不傳，MealOrder 已能推導；為了更明確所以加上：
            target: foodId == null ? "shop" : "food",
            // 若 mock/API 需要可留著，刪除也不會有問題
            seat_number: seatNumber,
        };

        await onAddReview?.(payload);
    };

    return (
       <div>
        <h2>
            Reviews (shopID: {shopId}
            {foodId != null ? `, foodID: ${foodId}` : ""}
            )
        </h2>

        <ReviewForm onSubmit={handleSubmit}/>

        {/* 顯示範圍內的評論；若不想在新增區顯示列表，這段可移除 */}
        <ReviewList reviews={scopedReviews}/>

       </div>
    )
}