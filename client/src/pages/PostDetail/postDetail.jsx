import "./postDetail.css";

import { useEffect } from "react";
import FriendPostTile from "../../components/FriendPostTile";
import PostTile from "../../components/PostTile";
import { dummyFriendPost } from "../../data/dummyPostFriend";

const PostDetail = () => {
  const containerStyle = {
    backgroundColor: "#2e2e2e",
  };

  useEffect(() => {
    console.log("Component Mounted");
  }, []);

  return (
    <div className="flex-1 flex p-3 md:p-11 gap-8" style={containerStyle}>
      <div className="bg-stone-800 hidden md:flex basis-1/4 p-6 flex-col items-center rounded-md">
        <div className="text-white font-normal text-xl mb-4"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
      <div className="bg-stone-800 flex-1 md:basis-3/4 md:p-6 p-3 rounded-md">
        <PostTile />
      </div>
    </div>
  );
};

export default PostDetail;
