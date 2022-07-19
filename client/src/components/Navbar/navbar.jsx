import "./navbar.css";

import { NavLink } from "react-router-dom";
import { FaHome, FaUserCircle, FaFacebookMessenger } from "react-icons/fa";

import NewPostBtn from "../NewPostBtn";
import logoSN from "../../../assets/LogoSN.png";

const NavBar = () => {
  let activeStyle = {
    fontWeight: "bold",
  };

  let unactiveStyle = {
    fontWeight: "normal",
    color: "grey",
  };

  return (
    <div className="navbar flex justify-between px-12 py-3 items-center">
      <div className="flex items-center">
        <img src={logoSN} alt="logoSN" className="h-6" />
        <div className="search-box ml-10">
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-gray-700 text-white sm:text-sm rounded-md"
            type="text"
            placeholder="Search a friend"
          />
        </div>
      </div>
      <div className="actions">
        <NavLink to="" className="flex items-center gap-2">
          <FaHome />
          Home
        </NavLink>
        <NavLink
          to="profile"
          className="flex items-center gap-2"
          style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
        >
          <FaUserCircle />
          Me
        </NavLink>
        <NavLink
          to="messages"
          className="flex items-center gap-2"
          style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
        >
          <FaFacebookMessenger />
          Messages
        </NavLink>
        {/* <button className="flex items-center text-green-600 text-3xl">
          <FaPlusCircle />
        </button> */}
        <NewPostBtn action={() => {}} />
      </div>
    </div>
  );
};

export default NavBar;
