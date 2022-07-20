import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const DashBoard = () => {
  return (
    <div className="dashboard flex flex-col h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default DashBoard;
