import { Routes, Route } from "react-router-dom";
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
        <Route path="/profile" element={<FrontLayout />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/job-info" element={<FrontLayout />}>
          <Route index element={<JobInfo />} />
        </Route>
        <Route path="/campus-news" element={<FrontLayout />}>
          <Route index element={<CampusNews />} />
        </Route>
        <Route path="/meal-order" element={<FrontLayout />}>
          <Route index element={<MealOrder />} />
        </Route>
        <Route path="/environment" element={<FrontLayout />}>
          <Route index element={<Environment />} />
        </Route>
        <Route path="/class-meeting" element={<FrontLayout />}>
          <Route index element={<ClassMeeting />} />
        </Route>
        <Route path="/tech-forum" element={<FrontLayout />}>
          <Route index element={<TechForum />} />
        </Route>
        <Route path="/data-analysis" element={<FrontLayout />}>
          <Route index element={<DataAnalysis />} />
        </Route>
        <Route path="/ai" element={<FrontLayout />}>
          <Route index element={<Ai />} />
        </Route>
        <Route path="/dev-team" element={<FrontLayout />}>
          <Route index element={<DevTeam />} />
        </Route>
        <Route path="/contact" element={<FrontLayout />}>
          <Route index element={<Contact />} />
        </Route>
        <Route path="/terms" element={<FrontLayout />}>
          <Route index element={<Terms />} />
        </Route>
        <Route path="/privacy" element={<FrontLayout />}>
          <Route index element={<Privacy />} />
        </Route>
        <Route path="/lunch" element={<FrontLayout />}>
          <Route index element={<Lunch />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 後台 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route path="/admin/news" element={<AdminLayout />}>
          <Route index element={<AdminNews />} />
        </Route>
        <Route path="/admin/meal-order" element={<AdminLayout />}>
          <Route index element={<AdminMealOrder />} />
        </Route>
        <Route path="/admin/environment" element={<AdminLayout />}>
          <Route index element={<AdminEnvironment />} />
        </Route>
        <Route path="/admin/class-meeting" element={<AdminLayout />}>
          <Route index element={<AdminClassMeeting />} />
        </Route>
        <Route path="/admin/tech-forum" element={<AdminLayout />}>
          <Route index element={<AdminTechForum />} />
        </Route>
        <Route path="/admin/data-analysis" element={<AdminLayout />}>
          <Route index element={<AdminDataAnalysis />} />
        </Route>
        <Route path="/admin/ai" element={<AdminLayout />}>
          <Route index element={<AdminAi />} />
        </Route>
        <Route path="/admin/dev-team" element={<AdminLayout />}>
          <Route index element={<AdminDevTeam />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;