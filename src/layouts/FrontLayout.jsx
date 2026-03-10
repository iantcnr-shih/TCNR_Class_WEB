import { Outlet, Navigate } from "react-router-dom";
import Navbar from "@/components/front/Navbar";
import Footer from "@/components/front/Footer";
import { useUser } from "@/components/auth/UserProvider";
import Swal from "sweetalert2";
import { useEffect } from "react";

// Layout Component
const FrontLayout = () => {

  const { user, loading } = useUser();

  useEffect(() => {
    if (!user) return;
    const path = location.pathname;
    const seatNumber = user.user?.seat_number;
    if (!seatNumber && !path.includes("profile")) {
      Swal.fire({
        icon: "warning",
        html: `<div class="text-2xl font-bold">歡迎您的加入</div><br/>
               <div class="text-lg">提醒您，尚未設定使用者身份</div><br/>
               <div class="inline-block cursor-pointer text-[rgb(43,131,226)] font-medium transition-all duration-200 hover:underline hover:text-[rgb(34,108,187)] hover:translate-x-0.5"
                onclick="location.href='profile'"
               >
                   前往設定
               </div>`,
        showConfirmButton: false,
        allowOutsideClick: true,
      });
    }
  }, [user]);

  if (loading) return <div className="w-screen text-center">Loading...</div>;
  
  return (
    <>
      <div className="w-screen ">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default FrontLayout;
