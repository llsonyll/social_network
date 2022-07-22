import "./navbar.css";

import { NavLink, Link } from "react-router-dom";
import { FaHome, FaUserCircle, FaFacebookMessenger } from "react-icons/fa";

import NewPostBtn from "../NewPostBtn";
import logoSN from "../../../assets/LogoSN.png";
import SearchUsersBox from "../SearchUsersBox/searchUsersBox";
import { useState } from "react";

const NavBar = ({ openModal }) => {
  let activeStyle = {
    fontWeight: "bold",
  };

  let unactiveStyle = {
    fontWeight: "normal",
    color: "grey",
  };

  const [searchInput, setSearchInput] = useState("");

  const handleInputValue = (e) => setSearchInput(e.target.value);

  return (
    <div className="navbar flex bg-[#252525] shadow-md justify-between px-4 md:px-12 py-3 items-center relative">
      <div className="flex items-center gap-4 flex-1 justify-between md:justify-start">
        <Link to="/home">
          <img src={logoSN} alt="logoSN" className="md:h-10 h-6 md:mr-4 mr-2" />
        </Link>
        <div className="search-box w-full md:w-60 relative">
          <input
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
            type="text"
            value={searchInput}
            onChange={handleInputValue}
            placeholder="Search a friend"
          />
          {searchInput.trim().length > 0 && <SearchUsersBox />}
        </div>
        <div className="text-white md:hidden"> menu </div>
      </div>
      <div className="actions hidden md:flex">
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
        <NewPostBtn action={openModal} />
      </div>
    </div>
  );
};

export default NavBar;
