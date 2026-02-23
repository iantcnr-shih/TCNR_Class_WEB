import React from "react";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p>目前尚無評論</p>;
  }

  return (
    <ul>
      {reviews.map((r, idx) => (
        <ReviewItem
          key={r.review_id ?? `${r.shop_id ?? "s"}-${r.food_id ?? "shop"}-${r.user_id ?? "u"}-${r.created_at ?? idx}`}
          review={r}
        />
      ))}
    </ul>
  );
}