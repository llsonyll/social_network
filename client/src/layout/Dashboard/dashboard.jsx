import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NewPost from "../../components/NewPost/newPost";

import { useState } from "react";

const DashBoard = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col" id='DashBoard'>
      <Navbar openModal={() => setShowModal(true)} />
      <NewPost showModal={showModal} setShowModal={setShowModal} />
      <Outlet />
    </div>
  );
};

export default DashBoard;
