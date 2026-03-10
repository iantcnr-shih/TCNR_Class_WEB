import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AaminLeftSode from "@/components/admin/AaminLeftSode";
import { useAdminUser } from "@/components/admin/AdminUserProvider";

function AdminLayout() {
  const { user, loading } = useAdminUser();

  if (loading) {
    return <div className="w-screen text-center">Loading...</div>;
  }

  if (!user?.user?.roles?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

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
