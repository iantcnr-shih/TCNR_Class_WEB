// pros : review
// shoe: user_name, rating(★), comment, created_at


import React from "react"; 

export default function ReviewItem({ review }) {
    return (
        <li>
            {review.user_name} : {review.rating}★ - {review.comment}
            <div style={{ fontSize: "12px", opacity: 0.7 }}>{review.created_at}</div>
        </li>
    );
}