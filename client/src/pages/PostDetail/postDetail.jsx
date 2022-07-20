import "./postDetail.css";

import FriendPostTile from "../../components/FriendPostTile";

const PostDetail = () => {
  const containerStyle = {
    backgroundColor: "#2e2e2e",
  };

  return (
    <div className="flex-1 flex px-11 pt-11 gap-8" style={containerStyle}>
      <div className="bg-stone-800 basis-1/4 p-6 flex flex-col items-center rounded-md">
        <div className="text-white font-semibold text-xl"> Your Friends</div>

        <FriendPostTile />
      </div>
      <div className="bg-stone-800 basis-3/4 p-6 rounded-md">
        <div className=""> Your Friends</div>
      </div>
    </div>
  );
};

export default PostDetail;
