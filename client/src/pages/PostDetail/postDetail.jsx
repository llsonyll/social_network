import "./postDetail.css";

import { useEffect } from "react";
import FriendPostTile from "../../components/FriendPostTile";
import PostTile from "../../components/PostTile";

const dummyFriendPost = [
  {
    postId: "1",
    publishedAt: 2,
    user: {
      id: "1",
      name: "Juanito",
      url: "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
    },
  },
  {
    postId: "2",
    publishedAt: 45,
    user: {
      id: "1",
      name: "Juanito",
      url: "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
    },
  },
  {
    postId: "3",
    publishedAt: 120,
    user: {
      id: "2",
      name: "Fernandito",
      url: "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
    },
  },
];

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
        {/* Comments */}
        {/* SubComments */}
      </div>
    </div>
  );
};

export default PostDetail;
