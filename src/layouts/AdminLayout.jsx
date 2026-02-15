import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AaminLeftSode from "@/components/admin/AaminLeftSode";
import React, { useState } from 'react';

function AdminLayout() {
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
