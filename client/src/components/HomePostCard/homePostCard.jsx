import { FaComment, FaHeart } from "react-icons/fa";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";

const HomePostCard = () => {
  const handleCommentPost = () => console.log("PostCard comment");
  const handleFavoritePost = () => console.log("PostCard favorite");

  return (
    <div className="bg-[#252525] w-full rounded-md md:p-4 p-2 flex flex-col text-white">
      <div className="flex hover:bg-[#353535] gap-4 md:p-2 rounded-md">
        {/* <Link to="user/1"> */}
        <Avatar size="xl" />
        {/* </Link> */}
        <Link to="post/1" className="flex-1">
          <div className="">Username</div>
          <div className="opacity-50">3hr</div>

          <div className="">
            Mollit magna est ea anim magna culpa non fugiat reprehenderit. Do
            anim laboris Lorem pariatur mollit tempor cupidatat aliqua in do.
            Reprehenderit sit consectetur irure et velit.
          </div>
        </Link>
      </div>
      <div className="actions flex gap-3 justify-end mt-1 md:mt-2 text-lg">
        <button
          className="flex items-center gap-1 hover:text-gray-300"
          onClick={handleCommentPost}
        >
          <FaComment />
          120
        </button>

        <button
          className="flex items-center gap-1 hover:text-gray-300"
          onClick={handleFavoritePost}
        >
          <FaHeart />
          12
        </button>
      </div>
    </div>
  );
};

export default HomePostCard;
