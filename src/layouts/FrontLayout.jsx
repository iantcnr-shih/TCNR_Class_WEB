import { Outlet } from "react-router-dom";

function FrontLayout() {
  return (
    <>
      <h1>前台 Navbar</h1>
      <Outlet />
    </>
  );
}

export default FrontLayout;
