import { Outlet } from "react-router-dom";
import Navbar from "@/components/front/Navbar";
import Footer from "@/components/front/Footer";
import { useUser } from "@/components/auth/UserProvider";
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import api from "@/api/axios";

// Layout Component
const FrontLayout = () => {

  const { user, setUser, loading, setLoading } = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
        const path = location.pathname;
        if (!res.data.user?.seat_number && !path.includes("profile")) {
          Swal.fire({
            icon: "warning",
            html: `<div class="text-xl">該帳號尚未設定座號</div><br/>
                   <div class="inline-block cursor-pointer text-[rgb(43,131,226)] font-medium transition-all duration-200 hover:underline hover:text-[rgb(34,108,187)] hover:translate-x-0.5"
                    onclick="location.href='profile'"
                   >
                       前往設定
                   </div>`,
            showConfirmButton: false, // ❌ 不顯示 OK
            allowOutsideClick: true,  // 可以點外面關閉
          });
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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
