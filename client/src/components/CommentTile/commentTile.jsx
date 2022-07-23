import Avatar from "../Avatar";
import { FaHeart } from "react-icons/fa";
// import { Link } from "react-router-dom";

const CommentTile = (props) => {
  // const handleReplyComment = () => {
  //   console.log("Reply Comment");
  // };
  const {data} = props

  const handleLikeComment = () => {
    console.log("Like Comment");
  };

  return (
    <div className="bg-[#353535] rounded-md md:p-2 p-1 flex my-3">
      {/* TODO: Avatar should redirect to user profile */}
      {/* <Link to="/user/:id"> */}
      <Avatar size="m" />
      {/* </Link> */}
      <div className="content flex-1 text-white pl-2">
        {/* TODO: Username should redirect to user profile */}
        <div className="font-medium text-base">{data? data.userId.username :"Username"}</div>
        <div className="font-light text-sm">
          {data? data.content : `Adipisicing fugiat elit officia ullamco id sit proident occaecat
          consequat tempor consequat ipsum nulla. Dolore aliqua pariatur laboris
          amet laborum magna. Ullamco id magna ullamco Lorem ipsum minim labore
          ipsum magna ullamco.`}
        </div>
        <div className="actions flex items-center gap-2 mt-1">
          {/* <button onClick={handleReplyComment} className="text-xs">
            Reply
          </button> */}
          <button
            onClick={handleLikeComment}
            className="flex gap-1 items-center hover:text-gray-300"
          >
            <FaHeart /> {data? data.likes.length : 12}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentTile;
