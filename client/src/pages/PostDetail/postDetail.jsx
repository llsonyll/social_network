import "./postDetail.css";

import FriendPostTile from "../../components/FriendPostTile";

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

  return (
    <div className="flex-1 flex px-11 pt-11 gap-8" style={containerStyle}>
      <div className="bg-stone-800 basis-1/4 p-6 flex flex-col items-center rounded-md">
        <div className="text-white font-medium text-xl mb-8"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
      <div className="bg-stone-800 basis-3/4 p-6 rounded-md">
        <div className=""> Your Friends</div>
      </div>
    </div>
  );
};

export default PostDetail;
