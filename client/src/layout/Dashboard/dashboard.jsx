import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdminBoard from "../../components/AdminBoard";
import NewPost from "../../components/NewPost/newPost";

import { useState } from "react";

const DashBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="flex flex-col" id="DashBoard">
      <Navbar
        openModal={() => setShowModal(true)}
        openAdmin={() => setShowAdmin(true)}
      />
      <NewPost showModal={showModal} setShowModal={setShowModal} />
      {showAdmin && (
        <AdminBoard showAdmin={showAdmin} setShowAdmin={setShowAdmin} />
      )}
      <Outlet />
    </div>
  );
};

export default DashBoard;
