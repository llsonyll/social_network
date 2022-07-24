import { FaComment, FaHeart } from "react-icons/fa";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";

const HomePostCard = () => {
  const handleCommentPost = () => console.log("PostCard comment");
  const handleFavoritePost = () => console.log("PostCard favorite");

  return (
    <div className="bg-[#252525] w-full rounded-md md:p-4 p-2 flex flex-col text-white">
      <div className="flex  gap-4 md:p-2 rounded-md" id="father__content">
        {/* <Link to="user/1"> */}
        <div id="Avatar_Username__container">
          <Avatar size="xl" />
          <div className="user_post__info">
            <h2>Username</h2>
            <span className="opacity-50" >3hr</span>
          </div>
        </div>
        {/* </Link> */}
        <Link to="post/1" className="hover:bg-[#353535]"  id="a_content">
          <div className="text-left" id="post_content">
            <div>
              {/* <img src="https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/03/28/15222363072573.jpg" alt="" /> */}
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque porro quae sequi harum repellat quisquam nobis libero dolor quos velit ut ducimus distinctio sit illum cum autem, doloremque quidem nemo.
              
              
            </div>
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
