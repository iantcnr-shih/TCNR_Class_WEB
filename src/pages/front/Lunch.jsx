import React from "react";
import { Link } from "react-router-dom";
import ReviewSection from "../../components/reviews/ReviewSection";

function Lunch() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 className="ian">測試頁面</h1>
      <p>歡迎來到 TCNR 系統</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/admin">
          <button style={buttonStyle}>前往後台</button>
        </Link>
      </div>
      {/* Reviews 區塊 */}
      <div style={{ marginTop: "40px" }}>
        <ReviewSection shopId={1} />
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
};

export default Lunch;



