import Avatar from "../Avatar";
import { FaHeart } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { newLikesComment } from "../../redux/actions/postActions";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

const CommentTile = ({ data }) => {
  // const handleReplyComment = () => {
  //   console.log("Reply Comment");
  // };

  console.log(data);

  const { _id } = useSelector((state) => state.auth.loggedUser);
  const dispatch = useDispatch();

  const handleLikeComment = () => {
    dispatch(newLikesComment(data._id, _id));
  };

  let renderHeartIcon = () => {
    if (!data.likes.includes(_id)) {
      return <FaHeart />;
    }
    if (data.likes.includes(_id)) {
      return (
        <IconContext.Provider
          value={{ color: "red", className: "global-heart-class-name" }}
        >
          <div>
            <FaHeart />
          </div>
        </IconContext.Provider>
      );
    }
  };

  return data?.userId ? (
    <div className="bg-[#353535] rounded-md md:p-2 p-1 flex my-3">
      {/* TODO: Avatar should redirect to user profile */}
      <div>
        <Link to={`/home/profile/${data.userId._id}`}>
          {data.userId.profilePicture ? (
            <Avatar imgUrl={data.userId.profilePicture} size="m" />
          ) : (
            <Avatar size="m" />
          )}
        </Link>
      </div>
      <div className="content flex-1 text-white pl-2">
        {/* TODO: Username should redirect to user profile */}
        <div className="font-medium text-base">
          <Link to={`/home/profile/${data.userId._id}`}>
            {data ? data.userId?.username : "Username"}
          </Link>
        </div>
        <div className="font-light text-sm">
          {data
            ? data.content
            : `Adipisicing fugiat elit officia ullamco id sit proident occaecat
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
            {renderHeartIcon()} {data ? data.likes.length : 12}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CommentTile;
