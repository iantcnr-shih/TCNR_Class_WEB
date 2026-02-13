import { Routes, Route } from "react-router-dom";
import FrontLayout from "@/layouts/FrontLayout";
// import AdminLayout from "./layouts/AdminLayout";
import Home from "@/pages/front/Home";
import Lunch from "@/pages/front/Lunch";
// import HomePage from "@/pages/front/HomePage";
// import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Routes>
      {/* 前台 */}
      <Route path="/" element={<FrontLayout />}>
        <Route index element={<Home />} />
      </Route>
      {/* <Route path="/lunch" element={<FrontLayout />}>
        <Route index element={<Lunch />} />
      </Route> */}
      {/* <Route path="/homepage" element={<FrontLayout />}>
        <Route index element={<HomePage />} />
      </Route> */}
      {/* 後台 */}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route> */}
    </Routes>
  );
}

export default App;