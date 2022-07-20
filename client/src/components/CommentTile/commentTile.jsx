import Avatar from "../Avatar";
import { FaHeart } from "react-icons/fa";

const CommentTile = () => {
  // const handleReplyComment = () => {
  //   console.log("Reply Comment");
  // };

  const handleLikeComment = () => {
    console.log("Like Comment");
  };

  return (
    <div className="bg-neutral-700 rounded-md px-2 py-2 flex my-3">
      <Avatar />
      <div className="content flex-1 text-white pl-2">
        <div className="font-medium text-base">Username</div>
        <div className="font-light text-sm">
          Adipisicing fugiat elit officia ullamco id sit proident occaecat
          consequat tempor consequat ipsum nulla. Dolore aliqua pariatur laboris
          amet laborum magna. Ullamco id magna ullamco Lorem ipsum minim labore
          ipsum magna ullamco.
        </div>
        <div className="actions flex items-center gap-2 mt-1">
          {/* <button onClick={handleReplyComment} className="text-xs">
            Reply
          </button> */}
          <button
            onClick={handleLikeComment}
            className="flex gap-1 items-center"
          >
            <FaHeart /> 12
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentTile;
