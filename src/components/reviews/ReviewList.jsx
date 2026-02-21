// props: reviews
// if review.length === 0 -> 顯示 目前尚無評論 else map ReviewItem

import React from "react";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviews }) {
    if(!reviews || reviews.length === 0) {
        return <p>目前尚無評論</p>;
    }

    return (
        <ul>
            {reviews.map((r) => (
                <ReviewItem key={r.review_id} review={r}/>
            ))}
        </ul>
    );
}