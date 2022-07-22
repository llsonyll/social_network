import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";

const Home = () => {
  return (
    <div className="flex-1 flex px-3 pt-3 md:px-11 md:pt-9 gap-8 bg-[#2e2e2e]">
      <div className="bg-stone-800 hidden md:flex basis-1/5 p-6 flex-col items-center rounded-md mb-3 md:mb-11">
        <div className="text-white font-normal text-xl mb-4"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-5 h-full">
        <HomePostCard />
        <HomePostCard />
        <HomePostCard />
        <HomePostCard />
        <HomePostCard />
      </div>
    </div>
  );
};

export default Home;
