import { useState, useRef } from "react";

import Avatar from "../Avatar";
import CommentTile from "../CommentTile";
// import CommentInput from "../CommentInput";

import { FaHeart } from "react-icons/fa";

const PostTile = () => {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef();

  const handleLikePost = () => {
    console.log("Like Post");
  };

  const handleCommentPost = async () => {
    console.log("Comment Post");
    setShowInput(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };

  return (
    <>
      <div className="flex ">
        <Avatar size="l" />
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="userInfo mb-3">
            <div className="text-white font-medium">Username</div>
            <div className="text-white opacity-50 text-xs">3hr</div>
          </div>
          <div className="text-white font-light text-base">
            Duis excepteur qui dolor anim non sit cillum velit sint deserunt.
            Consequat fugiat minim tempor nulla sunt ipsum incididunt enim ipsum
            minim nulla elit magna. Aute amet exercitation incididunt pariatur
            aliquip laborum culpa consectetur proident elit anim sint anim. Anim
            anim ut laborum laborum dolore. Officia nisi reprehenderit excepteur
            nisi. Esse tempor occaecat occaecat ex quis.
          </div>
          <div className="actions flex gap-3 items-center justify-end my-2 text-white">
            <button
              onClick={handleCommentPost}
              className="opacity-50 text-sm font-light"
            >
              Comment
            </button>
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-1"
                onClick={handleLikePost}
              >
                <FaHeart />
                12
              </button>
            </div>
          </div>

          <div className="comments">
            <CommentTile />
            <CommentTile />
            <CommentTile />
            <CommentTile />

            {showInput && (
              <div className="flex items-center">
                <Avatar />
                <input
                  ref={inputRef}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-gray-700 text-white sm:text-sm rounded-md ml-3"
                  type="text"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostTile;
