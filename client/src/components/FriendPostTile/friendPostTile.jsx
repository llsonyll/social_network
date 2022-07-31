import "./friendPostTile.css";

import Avatar from "../../components/Avatar";

import { NavLink } from "react-router-dom";
import {FaFacebookMessenger } from "react-icons/fa";

const FriendPostTile = ({ img, username, key , userId }) => {
  // console.log(user);

  // const getTimePublished = () => {
  //   // TODO: considerar no solo horas sino dias-meses-años
  //   const minutes = tile.publishedAt;
  //   if (minutes <= 1) return "1 minute ago";
  //   if (minutes < 60) return `${minutes} minutes ago`;
  //   if (minutes / 60 <= 1.5) return "1 hour ago";
  //   return `${Math.round(minutes / 60)} hours ago`;
  // };

  // const handleTileClick = () => {
  //   // TODO: receive a function as prop or just redirect to PostDetail with ID
  //   console.log(tile.postId);
  // };

  return (
    <NavLink
      to={`/home/profile/${userId}`}
      className="contenedorfriend flex w-full my-3 p-2 bg-[#353535] rounded-md hover:scale-105 transition-all"
      // onClick={handleTileClick}
    >
      <Avatar size="l" imgUrl={img} />
      <div className="contenedorfriend_info px-2 flex   items-center ">
        <div className="text-white text-md font-bold mb-1">{username}</div>
        {/* <div className="text-opacity-50 text-white text-sm font-normal leading-3">
          {getTimePublished()}
        </div> */}
      </div>
        
          <NavLink className='linkfriend_message' to={`/home/messages/${userId}`}>
            <button className="mess_friend_section"><FaFacebookMessenger/></button>
          </NavLink>
       
    </NavLink>
  );
};

export default FriendPostTile;
