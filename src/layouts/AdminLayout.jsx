import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <>
      <h1>後台 Sidebar</h1>
      <Outlet />
    </>
  );
}

export default AdminLayout;
