import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AaminLeftSode from "@/components/admin/AaminLeftSode";
import React, { useState, useEffect } from 'react';
import { useAdminUser } from "@/components/admin/AdminUserProvider";
import api from "@/api/axios";

function AdminLayout() {
  const { user, setUser, loading, setLoading } = useAdminUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

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
