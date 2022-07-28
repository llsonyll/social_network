import { FaComment, FaHeart } from "react-icons/fa";
import { IconContext } from 'react-icons'
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { newLikeHomePost, newDislikeHomePost } from "../../redux/actions/userActions";
import { useEffect } from "react";

const HomePostCard = (props) => {
  let dispatch = useDispatch();

  const handleCommentPost = () => console.log("PostCard comment");

  let { _id } = useSelector((state) => state.auth.loggedUser);
  let posts = useSelector((state) => state.user.homePostsData);

  let post = posts?.find( post => post._id === props.postId);

  const handleLikesPost = () => {
    dispatch(newLikeHomePost(post._id, _id,props.page));
  };

  const handleDislikesPost = () => {
    dispatch(newDislikeHomePost(post._id, _id,props.page));
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


  let renderHeartIcon = () => {
		if (!props.likes.includes(_id)) {
			return <FaHeart />
		}
		if (props.likes.includes(_id)) {
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
    <div className="bg-[#252525] w-full rounded-md md:p-4 p-2 flex flex-col text-white">
      <div className="flex  gap-4 md:p-2 rounded-md" id="father__content">
        <div id="Avatar_Username__container">
          <Link to={`profile/${props.userId}`}>
              {props.profilePicture? <Avatar imgUrl={props.profilePicture} size="xl" /> :<Avatar size="xl" />}
          </Link>
          <div className="user_post__info">
            <Link to={`profile/${props.userId}`}>
              <h2>{props.username}</h2>
            </Link>
            <span className="opacity-50" >{getTimeOfCreation(props.date)}</span>
          </div>
        </div>
        <Link to={`post/${props.postId}`} className="hover:bg-[#353535]"  id="a_content">
          <div className="text-left" id="post_content">
            <div>
            {props.content}
            </div>
          </div>
          {props.multimedia? <img src={props.multimedia} alt=''/>: null }
        </Link>
      </div>
      <div className="actions flex gap-3 justify-end mt-1 md:mt-2 text-lg">
        <Link to={`post/${props.postId}`} >
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
          {renderHeartIcon()}
          {props.likes? props.likes.length : 0}
        </button>
      </div>
    </div>
  );
};

export default HomePostCard;
