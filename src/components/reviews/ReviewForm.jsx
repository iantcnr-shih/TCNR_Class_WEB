import React, { useState } from "react";
import Swal from "sweetalert2";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      Swal.fire({
        title: "請輸入 1-5 的整數評分",
        icon: "warning",
      });
      return;
    }

    const trimmed = comment.trim();

    onSubmit?.({
      // 先固定，之後接登入
      user_id: 2,
      rating: r,
      comment: trimmed,
    });

    setComment("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
      <div style={{ marginBottom: "8px" }}>
        <label>
          星等：
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:scale-110`}
              >
                ★
              </div>
            ))}
            <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
          </div>
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label>
          評論：
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
            placeholder="寫下你的評論（可留空）"
            className="p-2 bg-white border border-gray-300"
          />
        </label>
      </div>

      <button type="submit" className="btn-review">送出評論</button>
    </form>
  );
}