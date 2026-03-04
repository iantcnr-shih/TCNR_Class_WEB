import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AaminLeftSode from "@/components/admin/AaminLeftSode";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAdminUser } from "@/components/admin/AdminUserProvider";
import api from "@/api/axios";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, setUser, loading, setLoading } = useAdminUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        if (!res.data.user.roles.includes("admin")) {
          navigate("/");
        }
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="w-screen text-center">Loading...</div>;
  if (!user || !user.user.roles.includes("admin")) return null;
  
  return (
    <>
      <div className="w-screen ">
        <AdminNavbar />
        <div className="flex w-full">
          <div className="hidden lg:block">
            <AaminLeftSode />
          </div>
          <div className="w-full lg:flex-1">
            <Outlet />
          </div>
        </div>
        <AdminFooter />
      </div>
    </>
  );
}

export default AdminLayout;
