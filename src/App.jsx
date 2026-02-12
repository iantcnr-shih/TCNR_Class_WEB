import { Routes, Route } from "react-router-dom";
import FrontLayout from "./layouts/FrontLayout";
// import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/front/Home";
// import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Routes>
      {/* 前台 */}
      <Route path="/" element={<FrontLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* 後台 */}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route> */}
    </Routes>
  );
}

export default App;