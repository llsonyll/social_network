import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";

const Home = () => {
  return (
    <div className="flex-1 flex pl-80 pt-3 md:pt-9 gap-8 bg-[#2e2e2e] relative " id="contenedor_home">
      <div className="fixed left-1 top-16 h-screen w-72 bg-stone-800  md:flex  p-6 flex-col items-center overflow-auto" id="contenedor_friends">
        <div className="text-white font-normal text-xl mb-4 uppercase tracking-wide"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile className='friends' tile={tile} key={tile.postId} />
        ))}
        
      </div>
      <div className="flex-1 flex flex-col gap-5 h-full w-screen" id="contenedor_posts">
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
