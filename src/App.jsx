import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import FrontLayout from "@/layouts/FrontLayout";
import Home from "@/pages/front/Home";
import Lunch from "@/pages/front/Lunch";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      navigate(redirect, { replace: true });
    }
  }, []);

  return null;
}

function App() {
  return (
    <>
      <RedirectHandler />
      <Routes>
        {/* 前台 */}
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/lunch" element={<FrontLayout />}>
          <Route index element={<Lunch />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 後台 */}
        <Route path="/admin/home" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;