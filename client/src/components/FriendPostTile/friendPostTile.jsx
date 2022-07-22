import "./friendPostTile.css";

import Avatar from "../../components/Avatar";

import { NavLink } from "react-router-dom";

const FriendPostTile = ({ tile }) => {
  // console.log(user);

  const getTimePublished = () => {
    // TODO: considerar no solo horas sino dias-meses-años
    const minutes = tile.publishedAt;
    if (minutes <= 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes / 60 <= 1.5) return "1 hour ago";
    return `${Math.round(minutes / 60)} hours ago`;
  };

  const handleTileClick = () => {
    // TODO: receive a function as prop or just redirect to PostDetail with ID
    console.log(tile.postId);
  };

  return (
    <NavLink
      to="/home/post/1"
      className="flex w-full my-3 p-2 hover:bg-[#353535] rounded-md"
      onClick={handleTileClick}
    >
      <Avatar size="l" imgUrl={tile.user.url} />
      <div className="px-2 flex flex-col justify-start items-start ">
        <div className="text-white text-lg font-bold">{tile.user.name}</div>
        <div className="text-opacity-50 text-white text-sm font-normal leading-3">
          {getTimePublished()}
        </div>
      </div>
    </NavLink>
  );
};

export default FriendPostTile;
