import { Outlet } from "react-router-dom";
import Navbar from "@/components/front/Navbar";
import Footer from "@/components/front/Footer";
import { useUser } from "@/components/front/UserProvider";
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
            text: "尚未設定座號",
            footer: `<a href='${import.meta.env.BASE_URL}profile'>前往設定</a>`
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
