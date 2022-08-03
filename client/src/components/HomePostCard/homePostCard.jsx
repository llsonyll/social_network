import { FaComment, FaHeart, FaExclamation } from "react-icons/fa";
import { IconContext } from "react-icons";
import Avatar from "../Avatar";
import MultimediaElement from "../MultimediaElement";
import { Link } from "react-router-dom";
import { ImHeartBroken } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import {
  newLikeHomePost,
  newDislikeHomePost,
  followOrUnfollowUser,
  getUserFollowings,
  makeReport,
} from "../../redux/actions/userActions";
import { useEffect } from "react";
import Swal from "sweetalert2";

const HomePostCard = (props) => {
  let dispatch = useDispatch();
  const loggedUser = useSelector((store) => store.auth.loggedUser);
  let { userFollowings } = useSelector((state) => state.user);
  const handleCommentPost = () => console.log("PostCard comment");

  let { _id } = useSelector((state) => state.auth.loggedUser);
  let posts = useSelector((state) => state.user.homePostsData);

  let post = posts?.find((post) => post._id === props.postId);

  const handleLikesPost = () => {
    dispatch(newLikeHomePost(post._id, _id, props.page));
  };

  const handleDislikesPost = () => {
    dispatch(newDislikeHomePost(post._id, _id, props.page));
  };

  function getTimeOfCreation(date) {
    let now = new Date().getTime();
    let created = new Date(date).getTime();
    const minutes = (now - created) / 60000;
    if (minutes <= 1) return "1 minute ago";
    if (minutes < 60) return `${Math.round(minutes)} minutes ago`;
    if (minutes / 60 <= 1.5) return "1 hour ago";
    if (minutes / 60 > 24 && minutes / 60 <= 36) return "1 day ago";
    if (minutes / 60 > 36) return `${Math.round(minutes / (60 * 24))} days ago`;
    return `${Math.round(minutes / 60)} hours ago`;
  }

  let homePostsData = useSelector((state) => state.user.homePostsData);
  let user = useSelector((state) => state.auth.loggedUser);

  let index = homePostsData.findIndex((post) => post._id === props.postId);

  let renderHeartIcon = () => {
    if (!homePostsData[index].likes.find((like) => like._id === user._id)) {
      return <FaHeart />;
    } else {
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

  const followRenderer = () => {
    let on = userFollowings.find((e) => {
      return e._id === props.userId;
    });
    if (on) {
      return <div key={Math.random()}>Unfollow</div>;
    } /*else if (props.followRequest?.length && props.followRequest?.map(u => u._id?.includes(user._id))) {
      return <div key={Math.random()}>Pending</div>
    }*/ else {
      return <div key={Math.random()}>Follow</div>;
    }
  };

  let renderHeartBrokenIcon = () => {
    if (
      !homePostsData[index].dislikes.find((dislike) => dislike._id === user._id)
    ) {
      console.log("Entra blanco");
      return <ImHeartBroken />;
    } else {
      console.log("Entra rojo");
      return (
        <IconContext.Provider
          value={{ color: "#9400D3", className: "global-heart-class-name" }}
        >
          <div>
            <ImHeartBroken />
          </div>
        </IconContext.Provider>
      );
    }
  };

  return (
    <div className="bg-[#252525] w-full rounded-md md:p-4 p-2 flex flex-col text-white">
      <div className="flex  gap-4 md:p-2 rounded-md" id="father__content">
        <div id="Avatar_Username__container">
          <Link to={`profile/${props.userId}`}>
            {props.profilePicture ? (
              <Avatar imgUrl={props.profilePicture} size="xl" />
            ) : (
              <Avatar size="xl" />
            )}
          </Link>
          <div className="user_post__info">
            <div className="flex">
              <Link to={`profile/${props.userId}`}>
                <h2>{props.username}</h2>
              </Link>
              {loggedUser._id != props.userId && (
                <button
                  type="button"
                  className="ml-2 text-green-600   outline-1 outline px-1 rounded-md hover:text-green-700 transition-all"
                  onClick={async () => {
                    console.log("hello");
                    console.log(props.userId);
                    dispatch(
                      followOrUnfollowUser(loggedUser._id, props.userId)
                    ).then(() => dispatch(getUserFollowings(loggedUser._id)));
                  }}
                >
                  {followRenderer()}
                </button>
              )}
            </div>
            <span className="opacity-50">{getTimeOfCreation(props.date)}</span>
          </div>
        </div>
        <Link
          to={`post/${props.postId}`}
          className="hover:bg-[#353535]"
          id="a_content"
        >
          <div className="text-left" id="post_content">
            <div>{props.content}</div>
          </div>
          {props.multimedia ? (
            <MultimediaElement source={props.multimedia} />
          ) : null}
        </Link>
      </div>
      <div className="actions flex gap-3 justify-end mt-1 md:mt-2 text-lg">
        <Link to={`post/${props.postId}`}>
          <button
            className="flex items-center gap-1 hover:text-gray-300"
            onClick={handleCommentPost}
          >
            <FaComment />
            {props.commentsId.length}
            {/* {props.dislikes.length} sería comments.length*/}
          </button>
        </Link>

        <button
          className="flex items-center gap-1 hover:text-gray-300"
          onClick={handleLikesPost}
        >
          {post && renderHeartIcon()}
          {homePostsData && homePostsData[index].likes.length}
        </button>

        <div className="flex items-center gap-1 hover:text-gray-300">
          <button
            className="flex items-center gap-1"
            onClick={handleDislikesPost}
          >
            {post && renderHeartBrokenIcon()}
            {homePostsData && homePostsData[index].dislikes.length}
          </button>
        </div>
        {_id !== post.userId?._id ? (

          <button
            className=" transition-all flex items-center gap-1 props.userId  text-red-500 hover:scale-110"
            onClick={() => {
              Swal.fire({
                background: "#4c4d4c",
                color: "white",
                title: "Submit your Report",
                input: "textarea",
                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Submit",
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                  dispatch(
                    makeReport(user._id, props.postId, {
                      reason: login,
                      reported: "post",
                    })
                  );
                },
                allowOutsideClick: () => !Swal.isLoading(),
              });
            }}
          >
            <FaExclamation />
          </button>
        ) : null}

      </div>
    </div>
  );
};

export default HomePostCard;
