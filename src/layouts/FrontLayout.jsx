import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Layout Component
const FrontLayout = () => {
  
  return (
    <>
      <div className="w-screen ">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default FrontLayout;
