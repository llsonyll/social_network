import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NewPost from "../../components/NewPost/newPost";

import { useState } from "react";

const DashBoard = () => {
  const [showModal, setShowModal] = useState(true);
  const openModal = () => setShowModal(true);
  return (
    <div className="dashboard flex flex-col h-screen">
      <Navbar openModal={openModal} />
      <NewPost showModal={showModal} setShowModal={setShowModal} />
      <Outlet />
    </div>
  );
};

export default DashBoard;
