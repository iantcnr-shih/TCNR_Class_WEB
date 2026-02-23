import React from "react";

export default function ReviewItem({ review }) {
  const userLabel = review.user_name ?? (review.user_id != null ? `User#${review.user_id}` : "匿名");
  const rating = Number(review.rating ?? 0);
  const comment = (review.comment ?? "").trim();

  return (
    <li>
      {userLabel} : {Number.isFinite(rating) ? rating : 0}★ - {comment || "（未填寫評論）"}
      {review.created_at ? (
        <div style={{ fontSize: "12px", opacity: 0.7 }}>{review.created_at}</div>
      ) : null}
    </li>
  );
}