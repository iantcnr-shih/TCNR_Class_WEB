import React, { useState } from "react";

export default function ReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const r = Number(rating);
        if(!Number.isInteger(r) || r < 1 || r > 5) {
            alert("rating 必須是 1~5");
            return;
        }

        onSubmit({
            // 先固定，之後接登入
            user_id: 2,
            // 先不選餐點
            food_id: null,
            rating: r,
            comment: comment.trim(),
        });

        setComment("");
        setRating(5);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
            <div style={{ marginBottom: "8px" }}>
                <label>
                    星等：
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "8px" }}>
                <label>
                    評論：
                    <br/>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        style={{ width: "100%"}}
                        placeholder="寫下你的評論（可留空）"
                        />
                </label>
            </div>
            
            <button type="submit">送出評論</button>
        </form>
    );
}