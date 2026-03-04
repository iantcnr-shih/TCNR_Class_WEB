import { Routes, Route } from "react-router-dom";
import { AdminUserProvider } from "@/components/admin/AdminUserProvider";
import AdminLayout from "@/layouts/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import AdminNews from "@/pages/admin/AdminNews";
import AdminMealOrder from "@/pages/admin/AdminMealOrder";
import AdminEnvironment from "@/pages/admin/AdminEnvironment";
import AdminClassMeeting from "@/pages/admin/AdminClassMeeting";
import AdminTechForum from "@/pages/admin/AdminTechForum";
import AdminDataAnalysis from "@/pages/admin/AdminDataAnalysis";
import AdminAi from "@/pages/admin/AdminAi";
import AdminDevTeam from "@/pages/admin/AdminDevTeam";
import { UserProvider } from "@/components/auth/UserProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FrontLayout from "@/layouts/FrontLayout";
import Home from "@/pages/front/Home";
import Profile from "@/pages/front/Profile/Profile";
import JobInfo from "@/pages/front/JobInfo/JobInfo";
import CampusNews from "@/pages/front/CampusNews/CampusNews";
import MealOrder from "@/pages/front/MealOrder/MealOrder";
import Environment from "@/pages/front/Environment/Environment";
import ClassMeeting from "@/pages/front/ClassMeeting/ClassMeeting";
import TechForum from "@/pages/front/TechForum/TechForum";
import DataAnalysis from "@/pages/front/DataAnalysis/DataAnalysis";
import Ai from "@/pages/front/Ai/Ai";
import DevTeam from "@/pages/front/DevTeam/DevTeam";
import Contact from "@/pages/front/Contact/Contact";
import Terms from "@/pages/front/Terms/Terms";
import Privacy from "@/pages/front/Privacy/Privacy";
import Lunch from "@/pages/front/Lunch";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
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
        <Route path="/" element={
          <UserProvider>
            <FrontLayout />
          </UserProvider>
        }>
          <Route index element={<Home />} />
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          />
          <Route path="job-info" element={<JobInfo />} />
          <Route path="campus-news" element={<CampusNews />} />
          <Route path="meal-order" element={<MealOrder />} />
          <Route path="environment" element={<Environment />} />
          <Route path="class-meeting" element={<ClassMeeting />} />
          <Route path="tech-forum" element={<TechForum />} />
          <Route path="data-analysis" element={<DataAnalysis />} />
          <Route path="ai" element={<Ai />} />
          <Route path="dev-team" element={<DevTeam />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="lunch" element={<Lunch />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* 後台 */}
        <Route path="/admin" element={
          <AdminUserProvider>
            <AdminLayout />
          </AdminUserProvider>
        }>
          <Route index element={<AdminHome />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="meal-order" element={<AdminMealOrder />} />
          <Route path="environment" element={<AdminEnvironment />} />
          <Route path="class-meeting" element={<AdminClassMeeting />} />
          <Route path="tech-forum" element={<AdminTechForum />} />
          <Route path="data-analysis" element={<AdminDataAnalysis />} />
          <Route path="ai" element={<AdminAi />} />
          <Route path="admin/dev-team" element={<AdminDevTeam />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;