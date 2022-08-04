import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import CommentTile from "../CommentTile";
import LoadingSpinner from "../LoadingSpinner";
// import CommentInput from "../CommentInput";
import { FaHeart, FaExclamation } from "react-icons/fa";
import { ImHeartBroken } from "react-icons/im";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/actions/commentActions";
import {
  newDislikesPostTitle,
  newlikePostTitle,
} from "../../redux/actions/postActions";
import { TiArrowBack } from "react-icons/ti";
import "./postTile.css";
import { makeReport } from "../../redux/actions/userActions";
import Swal from "sweetalert2";
import { postNotification } from "../../redux/actions/notificationActions";

const PostTile = ({ post }) => {
  const [showInput, setShowInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef();
  const user = useSelector((store) => store.auth.loggedUser);
  const dispatch = useDispatch();

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

  const handleLikePost = () => {
    dispatch(newlikePostTitle(post._id, user._id));
    if(user._id !== post.userId._id){
      dispatch(postNotification({
        type:'postLike',
        refId: post._id,
        fromId: user._id,
        toId: post.userId._id,
        username: user.username,
        profilePicture: user.profilePicture
      }))
    }
  };

  const handleDislikesPost = () => {
    dispatch(newDislikesPostTitle(post._id, user._id));
  };

  const handleCommentPost = async () => {
    setShowInput(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
    if(user._id !== post.userId._id){
      dispatch(postNotification({
        type:'comment',
        refId: post._id,
        fromId: user._id,
        toId: post.userId._id,
        username: user.username,
        profilePicture: user.profilePicture
      }))
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    dispatch(createComment(user._id, post._id, { content: commentInput }));
    setCommentInput("");
  };

  const { likes, dislikes } = useSelector((state) => state.post.postDetail);

  let renderHeartIcon = () => {
    if (!likes.find((like) => like._id === user?._id)) {
      return <FaHeart />;
    } else {
      return (
        <IconContext.Provider
          value={{ color: "#EA544A", className: "global-heart-class-name" }}
        >
          <div>
            <FaHeart />
          </div>
        </IconContext.Provider>
      );
    }
  };

  let renderHeartBrokenIcon = () => {
    if (!dislikes.find((dislike) => dislike._id === user?._id)) {
      return <ImHeartBroken />;
    } else {
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
    <>
      <div className="flex">
        <div>
          {post && post.userId ? (
            <Link to={`/home/profile/${post.userId._id}`}>
              {post.userId.profilePicture ? (
                <Avatar imgUrl={post.userId.profilePicture} size="xl" />
              ) : (
                <Avatar size="xl" />
              )}
            </Link>
          ) : null}
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="userInfo mb-3">
            <button
              onClick={() => {
                history.back();
              }}
              className="divStyle"
            >
              <TiArrowBack />
            </button>
            <div className="text-white font-medium">
              {post && post.userId ? (
                <Link to={`/home/profile/${post.userId._id}`}>
                  {post && post.userId ? post.userId.username : "Username"}
                </Link>
              ) : null}
            </div>
            <div className="text-white opacity-50 text-xs">
              {post && post.createdAt
                ? getTimeOfCreation(post.createdAt)
                : "3hr"}
            </div>
          </div>
          <div className="text-white font-light text-base">
            {post
              ? post.content
              : `Duis excepteur qui dolor anim non sit cillum velit sint deserunt.
            Consequat fugiat minim tempor nulla sunt ipsum incididunt enim ipsum
            minim nulla elit magna. Aute amet exercitation incididunt pariatur
            aliquip laborum culpa consectetur proident elit anim sint anim. Anim
            anim ut laborum laborum dolore. Officia nisi reprehenderit excepteur
            nisi. Esse tempor occaecat occaecat ex quis.`}
          </div>
          {post ? (
            post.multimedia ? (
              <img src={post.multimedia} alt="" />
            ) : null
          ) : null}
          <div className="actions flex gap-3 items-center justify-end my-2 text-white ">
            <button
              onClick={handleCommentPost}
              className="opacity-50 text-sm font-light hover:opacity-100 hover:font-semibold"
            >
              Comment
            </button>
            <div className="flex items-center gap-1 hover:text-gray-300">
              <button
                className="flex items-center gap-1"
                onClick={handleLikePost}
              >
                {post && post.likes && renderHeartIcon()}
                {likes && likes.length}
              </button>
            </div>
            <div className="flex items-center gap-1 hover:text-gray-300">
              <button
                className="flex items-center gap-1"
                onClick={handleDislikesPost}
              >
                {post && post.dislikes && renderHeartBrokenIcon()}
                {dislikes && dislikes.length}
              </button>
            </div>

          {user._id !== post.userId?._id ?
            <button
              className="flex items-center gap-1"
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
                      makeReport(user._id, post._id, {
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
          : null}
          </div>

          <div className="comments">
            {post && post.commentsId
              ? post.commentsId.map((e) => (
                  <CommentTile props={{ post }} data={e} />
                ))
              : null}

            {showInput && (
              <form className="flex items-center" onSubmit={handleInputSubmit}>
                {user.profilePicture ? (
                  <Avatar imgUrl={user.profilePicture} />
                ) : (
                  <Avatar />
                )}
                <input
                  ref={inputRef}
                  value={commentInput}
                  onChange={handleCommentInput}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-gray-700 text-white sm:text-sm rounded-md ml-3"
                  type="text"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostTile;
