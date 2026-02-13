import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";

function FrontLayout() {
  return (
    <>
      <h1>前台 Navbar</h1>
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}

export default FrontLayout;
