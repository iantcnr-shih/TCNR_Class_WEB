import { Navigate } from "react-router-dom";
import { useUser } from "@/components/auth/UserProvider"; // 假設你用 UserProvider 管理登入狀態

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser(); // user 如果存在代表已登入
  if (loading) {
    // 使用者資料還沒拿到，顯示載入中或 spinner
    return <div className="text-center p-4">載入中...</div>;
  }
  if (!user) {
    // 未登入，導向首頁或登入頁
    return <Navigate to="/" replace />;
  }

  // 已登入，顯示內容
  return children;
};

export default ProtectedRoute;