import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import CommentTile from "../CommentTile";
// import CommentInput from "../CommentInput";
import { FaHeart } from "react-icons/fa";
import { IconContext } from 'react-icons'
import { useDispatch, useSelector } from "react-redux";
import { createComment } from '../../redux/actions/commentActions'
import { newDislikesPostTitle, newlikePostTitle } from "../../redux/actions/postActions";
import { TiArrowBack } from "react-icons/ti";
import './postTile.css';


const PostTile = (props) => {
  const [showInput, setShowInput] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef();
  const user = useSelector(store => store.auth.loggedUser)
  const dispatch = useDispatch();
  function getTimeOfCreation(date){
    let now = new Date().getTime()
    let created = new Date(date).getTime()
    const minutes = ((now - created)/60000);
    if (minutes <= 1) return "1 minute ago";
    if (minutes < 60) return `${Math.round(minutes)} minutes ago`;
    if (minutes / 60 <= 1.5) return "1 hour ago";
    if ((minutes /60 > 24) && (minutes/60 <= 36)) return '1 day ago';
    if (minutes /60 > 36) return `${Math.round(minutes / (60*24))} days ago`
    return `${Math.round(minutes / 60)} hours ago`;
  }



  const {post} = props

  const handleLikePost  = () => {
    dispatch(newlikePostTitle(post._id, user._id));
  };

  const handleDislikesPost = () => {
    let { postId } = props;
    dispatch(newDislikesPostTitle(postId, _id));
  };

  const handleCommentPost = async () => {
    console.log("Comment Post");
    setShowInput(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
  }

  const handleInputSubmit = (e) => {
    e.preventDefault();
    console.log(commentInput);
    
    dispatch(createComment(user._id, post._id, {content: commentInput}))
    setCommentInput("");
  };


  
  
  
   
  const {likes} = useSelector(state => state.post.postDetail)
 console.log(post?.likes)
  console.log(user?._id);
  console.log(likes?.includes(user?._id)); 


  let renderHeartIcon = () => {
    if (!post?.likes.includes(user?._id)) {
      console.log('Entra blanco');
      return <FaHeart />
    }
    if (post?.likes.includes(user?._id)) {

      console.log('Entra rojo');
      return (
        <IconContext.Provider value={{ color: 'red', className: 'global-heart-class-name' }}>
          <div>
            <FaHeart />
          </div>
        </IconContext.Provider>
      )
    }
  }
  



  return (
    <>
      <div className="flex ">
        <Link to={`/home/profile/${post?.userId._id}`}> 
        {post?.userId.profilePicture? <Avatar imgUrl={post.userId.profilePicture} size="xl" /> : <Avatar size="xl" />}
        </Link>
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="userInfo mb-3">
            <button onClick={() => {history.back()}} className='divStyle' >
              <TiArrowBack />
            </button>
            <Link to={`/home/profile/${post?.userId._id}`}> 
              <div className="text-white font-medium">{post? post.userId.username : 'Username'}</div>
            </Link>
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
                  {post && renderHeartIcon()}
                {post? post.likes.length : 12}
              </button>
            </div>
          </div>

          <div className="comments">
            {post? post.commentsId.map(e =>  <CommentTile data={e}/>) : <>
            </>}

            {showInput && (
              <form className="flex items-center" onSubmit={handleInputSubmit}>
                {user.profilePicture? <Avatar imgUrl={user.profilePicture}/>:<Avatar />}
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
