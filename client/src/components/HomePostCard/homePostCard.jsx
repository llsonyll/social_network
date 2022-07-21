import { FaComment, FaHeart } from "react-icons/fa";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";

const HomePostCard = () => {
  return (
    <Link
      to="post/1"
      className="bg-stone-800 w-full rounded-md md:p-6 p-3 flex text-white"
    >
      <Avatar size="xl" />
      <div className="flex-1 pl-2 md:pl-4">
        <div className="">Username</div>
        <div className="opacity-50">3hr</div>

        <div className="">
          Mollit magna est ea anim magna culpa non fugiat reprehenderit. Do anim
          laboris Lorem pariatur mollit tempor cupidatat aliqua in do.
          Reprehenderit sit consectetur irure et velit.
        </div>

        <div className="actions flex gap-3 justify-end mt-2 md:mt-4 text-lg">
          <button className="flex items-center gap-1">
            <FaComment />
            120
          </button>

          <button className="flex items-center gap-1">
            <FaHeart />
            12
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HomePostCard;
