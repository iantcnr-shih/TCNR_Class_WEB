import React ,{ useEffect, useState } from "react";
import { createReview, getReviews } from "../../api/reviews.mock";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";


export default function ReviewSection({ shopId }) {
    const [reviews, setReviews] = useState([]);

    // mock 假資料
    useEffect(() => {
        getReviews(shopId).then(setReviews);
     }, [shopId]);

     const handleCreate = (payload) => {
        createReview(shopId, payload).then((newReview) => {
            setReviews((prev) => [newReview, ...prev]);
        });
    };

    return (
        <div>
            <h2>Reviews (shopID: {shopId})</h2>

            <ReviewForm onSubmit={handleCreate} />
            <ReviewList reviews={reviews} />
        </div>
    );
}



