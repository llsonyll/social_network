import "./navbar.css";

import { NavLink } from "react-router-dom";

const NavBar = () => {
  let activeStyle = {
    fontWeight: "bold",
  };

  return (
    <div className="navbar flex justify-between px-12 py-2">
      <div className="home center">SN</div>
      <div className="search-box">
        <input type="text" placeholder="Search a friend" />
      </div>
      <div className="actions">
        <NavLink to="">
          {/* icon */}
          Home
        </NavLink>
        <NavLink
          to="profile"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          {/* icon */}
          Me
        </NavLink>
        <NavLink
          to="messages"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          {/* icon */}
          Messages
        </NavLink>
        <div className="option-btn">
          <button> + </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
