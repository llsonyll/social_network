import "./navbar.css";

const NavBar = () => {
  return (
    <div className="navbar flex justify-between px-12 py-2">
      <div className="home center">SN</div>
      <div className="search-box">
        <input type="text" placeholder="Search a friend" />
      </div>
      <div className="actions">
        <div className="option-text">
          {/* icon */}
          Profile
        </div>
        <div className="option-text">
          {/* icon */}
          Home
        </div>
        <div className="option-text">
          {/* icon */}
          Messages
        </div>
        <div className="option-btn">
          <button> + </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
