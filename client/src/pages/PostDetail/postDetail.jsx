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
    <div className="flex-1 flex px-11 pt-11 gap-8" style={containerStyle}>
      <div className="bg-stone-800 basis-1/4 p-6 flex flex-col items-center rounded-md">
        <div className="text-white font-normal text-xl mb-4"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
      <div className="bg-stone-800 basis-3/4 p-6 rounded-md">
        <PostTile />
        {/* Comments */}
        {/* SubComments */}
      </div>
    </div>
  );
};

export default PostDetail;
