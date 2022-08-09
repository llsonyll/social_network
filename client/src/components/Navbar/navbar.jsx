import "./navbar.css";

import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle, FaFacebookMessenger } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { GiCrownedSkull } from "react-icons/gi";

import NewPostBtn from "../NewPostBtn";
import logoSN from "../../../assets/LogoSN.png";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  browserAction,
  browserCleanUp,
} from "../../redux/actions/browserActions";
import { logOutUser } from "../../redux/reducers/authReducer.slice";
import { MdOutlineLogout, MdAdminPanelSettings } from "react-icons/md";
import SearchResults from "../SearchResults/searchResults";
import { socket } from "../../App";

const NavBar = ({ openModal, openAdmin }) => {
  let activeStyle = {
    fontWeight: "bold",
  };

  let unactiveStyle = {
    fontWeight: "normal",
    color: "grey",
  };
   
  const [blur, setBlur] = useState(false);
  let input = useRef();
  const [menuActivo ,setmenuActivo] = useState(false)
  const [mostrarMenu , setMostrarMenu] = useState(false)
  const [searchInput, setSearchInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [unseen, setUnseen] = useState(0);
  const { searches } = useSelector((state) => state.browserReducer);
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const isAdmin = useSelector((state) => state.auth.loggedUser.isAdmin);
  const isPremium = useSelector((state) => state.auth.loggedUser.isPremium);
  const notifications = useSelector(
    (store) => store.notification.notifications
  );
  const unseenMessages = useSelector((state) => state.chat.unseenMessages)

  let navigate = useNavigate();
  let dispatch = useDispatch();

  const handleSearchAction = async (text) => {
    setSearched(false);
    await dispatch(browserAction(text));
    setSearched(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let search = searchInput.trim();
    if (search || (!search && searches.length !== 0)) {
      handleSearchAction(search);
    }
  };

  const handleLogOut = () => {
    socket.emit('logout', userId)
    dispatch(logOutUser());
    navigate("/");
  };

  const handleSelectRecent = (recentName) => {
    setTimeout(()=>{
      setSearchInput(recentName);
      handleSearchAction(recentName);
      input.current.focus();
    },500);
  };

  useEffect(() => {
    if (searchInput.length === 0) {
      setSearched(false);
      dispatch(browserCleanUp());
    }
  }, [searchInput]);

  useEffect(() => {
    if (notifications.length) {
      let checkUnseen = 0;
      notifications.forEach((notif) => {
        if (notif.seen === false) {
          checkUnseen++;
        }
      });
      setUnseen(checkUnseen);
    }
  }, [notifications]);

  const handlerBlur = (action) => {
     if(action !== 'blur'){
      setBlur(false)
     }else{
       setTimeout(()=>{
         setSearchInput("");
         setBlur(true);
       },500);
     }
  };

  const MenuAnimation = () => {
    setmenuActivo(state => !state)
    setMostrarMenu(state => !state)
  }

  return (
    <div className="navbar flex bg-[#252525] shadow-md justify-between px-4 md:px-12 py-3 items-center  sticky top-0 left-0 right-0 z-50 relative">
      <div className="flex items-center gap-4 flex-1 justify-between md:justify-start">
        <Link to="/home">
          <img src={logoSN} alt="logoSN" className="md:h-10 h-6 md:mr-4 mr-2" />
        </Link>
        <div className="search-box w-full lg:w-60 relative">
          <form onSubmit={handleSearchSubmit}>
            <input
              className=" h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
              type="text"
              maxLength="50"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              ref={input}
              onFocus={handlerBlur}
              onBlur={()=>handlerBlur('blur')}
              placeholder="Search a friend"
            />
          </form>
          {
            !blur && 
            <SearchResults
            input={searchInput}
            setInput={setSearchInput}
            selectRecent={handleSelectRecent}
            searched={searched}
            setSearched={setSearched}
            />
          }
        </div>
        <div className="text-white lg:hidden">
          <div className="icon__menu" onClick={MenuAnimation}>
            <span className={menuActivo === true ? 'active-line1' : null} ></span>
            <span className={menuActivo === true ? 'active-line2' : null} ></span>
            <span className={menuActivo === true ? 'active-line3' : null}></span>
          </div>
          <div className={`menu_responsive actions  flex-col absolute pt-5 ${mostrarMenu === true ? 'menu_responsive-mostrar' : null }`}>
                  <NewPostBtn action={openModal} onClick={MenuAnimation}/>
                  <NavLink to="" className="flex items-center gap-2" onClick={MenuAnimation}>
                    <FaHome />
                    Home
                  </NavLink>
                  <NavLink
                    to={`/home/notifications`}
                    className="flex items-center gap-2 relative "
                    style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
                    onClick={MenuAnimation}
                  >
                    <MdNotifications className="text-2xl" />
                    {unseen ? <span className="alert_notification">{unseen}</span> : null}
                    Notifications
                  </NavLink>
                  <NavLink
                    to={`profile/${userId}`}
                    className="flex items-center gap-2"
                    style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
                    onClick={MenuAnimation}
                  >
                    {isPremium ? <GiCrownedSkull /> : <FaUserCircle />}
                    Me
                  </NavLink>
                  <NavLink
                    to="messages"
                    className="flex items-center gap-2 relative"
                    style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
                    onClick={MenuAnimation}
                  >
                    <FaFacebookMessenger />
                    {unseenMessages ? <span className="alert_notification w-3 h-3 top-1"></span>  : null}
                    Messages
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      className="bg-blue-700 p-2 rounded font-bold text-xl w-5/6 flex justify-center"
                      to="administrator"
                      onClick={MenuAnimation}
                    >
                      <MdAdminPanelSettings />
                    </NavLink>
                  )}
                  <button
                    className="bg-red-500 p-2 rounded font-bold text-xl w-5/6 flex justify-center mt-16"
                    onClick={handleLogOut}
                  >
                    <MdOutlineLogout />
                  </button>
          </div>
        </div>
      </div>
      <div className="actions hidden lg:flex">
        <NavLink to="" className="flex items-center gap-2">
          <FaHome />
          Home
        </NavLink>
        <NavLink
          to={`/home/notifications`}
          className="flex items-center gap-2 relative "
          style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
        >
          <MdNotifications className="text-2xl" />
          {unseen ? <span className="alert_notification">{unseen}</span> : null}
          Notifications
        </NavLink>
        <NavLink
          to={`profile/${userId}`}
          className="flex items-center gap-2"
          style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
        >
          {isPremium ? <GiCrownedSkull /> : <FaUserCircle />}
          Me
        </NavLink>
        <NavLink
          to="messages"
          className="flex items-center gap-2 relative"
          style={({ isActive }) => (isActive ? activeStyle : unactiveStyle)}
        >
          <FaFacebookMessenger />
          {unseenMessages ? <span className="alert_notification w-3 h-3 top-1"></span>  : null}
          Messages
        </NavLink>
        <button
          className="bg-red-500 p-2 rounded font-bold text-lg"
          onClick={handleLogOut}
        >
          <MdOutlineLogout />
        </button>
        {isAdmin && (
          <NavLink
            className="bg-blue-700 p-2 rounded font-bold text-lg"
            to="administrator"
          >
            <MdAdminPanelSettings />
          </NavLink>
        )}
        <NewPostBtn action={openModal} />
      </div>
    </div>
  );
};

export default NavBar;
