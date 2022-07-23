import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";

import Avatar from "../Avatar";
import CommentTile from "../CommentTile";
// import CommentInput from "../CommentInput";

import { FaHeart } from "react-icons/fa";


const PostTile = (props) => {
  const [showInput, setShowInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef();

  let {post} = props

  function getTimeOfCreation(date){
    let now = new Date().getTime()
    let created = new Date(date).getTime()
    const minutes = ((now - created)/6000);
    if (minutes <= 1) return "1 minute ago";
    if (minutes < 60) return `${Math.round(minutes)} minutes ago`;
    if (minutes / 60 <= 1.5) return "1 hour ago";
    if ((minutes /60 > 24) && (minutes/60 <= 36)) return '1 day ago';
    if (minutes /60 > 36) return `${Math.round(minutes / (60*24))} days ago`
    return `${Math.round(minutes / 60)} hours ago`;
  }



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

  const handleCommentInput = (e) => setCommentInput(e.target.value);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    console.log(commentInput);
    setCommentInput("");
  };





  return (
    <>
      <div className="flex ">
        {/* <Link to="/user/:id" >  */}
        <Avatar size="xl" />
        {/* </Link> */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="userInfo mb-3">
            <div className="text-white font-medium">{post? post.userId.username : 'Username'}</div>
            <div className="text-white opacity-50 text-xs">{post? getTimeOfCreation(post.createdAt):"3hr"}</div>
          </div>
          <div className="text-white font-light text-base">
            {post? post.content : `Duis excepteur qui dolor anim non sit cillum velit sint deserunt.
            Consequat fugiat minim tempor nulla sunt ipsum incididunt enim ipsum
            minim nulla elit magna. Aute amet exercitation incididunt pariatur
            aliquip laborum culpa consectetur proident elit anim sint anim. Anim
            anim ut laborum laborum dolore. Officia nisi reprehenderit excepteur
            nisi. Esse tempor occaecat occaecat ex quis.`}
          </div>
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
                <FaHeart />
                {post? post.likes.length : 12}
              </button>
            </div>
          </div>

          <div className="comments">
            {post? post.commentsId.map(e =>  <CommentTile data={e}/>) : <>
            <CommentTile />
            <CommentTile />
            <CommentTile />
            <CommentTile />
            </>}

            {showInput && (
              <form className="flex items-center" onSubmit={handleInputSubmit}>
                <Avatar />
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
