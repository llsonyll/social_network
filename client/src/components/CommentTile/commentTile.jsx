import Avatar from "../Avatar";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { newLikesComment } from "../../redux/actions/postActions";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

const CommentTile = (props) => {
  // const handleReplyComment = () => {
  //   console.log("Reply Comment");
  // };
  const {data} = props

 const { _id } = useSelector(state => state.auth.loggedUser);
 const dispatch = useDispatch();

  const handleLikeComment = () => {
    dispatch(newLikesComment( data._id,_id))
  };

  return (
    data?.userId ? 
    <div className="bg-[#353535] rounded-md md:p-2 p-1 flex my-3">
      {/* TODO: Avatar should redirect to user profile */}
      <Link to={`/home/profile/${data.userId._id}`}>
      {data.userId.profilePicture? <Avatar imgUrl={data.userId.profilePicture} size="m" />:<Avatar size="m" />}
      </Link>
      <div className="content flex-1 text-white pl-2">
        {/* TODO: Username should redirect to user profile */}
        <Link to={`/home/profile/${data.userId._id}`}>
          <div className="font-medium text-base">{data? data.userId?.username :"Username"}</div>
        </Link>
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
    : <></>
  );
};

export default CommentTile;
