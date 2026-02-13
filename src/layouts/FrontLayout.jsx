import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Layout Component
const FrontLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default FrontLayout;
