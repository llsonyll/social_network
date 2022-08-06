import { FaComment, FaHeart, FaExclamation } from "react-icons/fa";
import { IconContext } from "react-icons";
import Avatar from "../Avatar";
import MultimediaElement from "../MultimediaElement";
import { AiOutlineMore } from "react-icons/ai";
import { ImHeartBroken } from "react-icons/im";
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newDislikeUserProfile, newLikeUserProfile } from '../../redux/actions/userActions'
import { makeReport } from '../../redux/actions/reportActions';
import Swal from 'sweetalert2';
import EditPost from '../EditPost/editPost';
import { listLikes, listDislikes, clearAll } from '../../redux/actions/listOfUsersRendererActions'
import { postNotification } from '../../redux/actions/notificationActions';
import { useEffect } from "react";
import ListOfUsersRenderer from '../ListOfUsersRenderer/listOfUsersRenderer';

const ProfilePosts = (props) => {

  const {
    userId,
    postNumber,
    fullname,
    timeAgo,
    content,
    commentsLength,
    multimedia,
  } = props;
  const [showMore, setShowMore] = useState('')
  const [dislike,setDislike] = useState('')
  const [like,setLike] = useState('')
  
  useEffect(()=> {
    setShowMore(content)
  }, [content])
  const [editPost, setEditPost] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showDislikes, setShowDislikes] = useState(false);

  let isPremium = useSelector((state) => state.auth.loggedUser.isPremium);

	const { _id } = useSelector(state => state.auth.loggedUser);
	const loggedUser = useSelector(state => state.auth.loggedUser)
  const dispatch = useDispatch();

  let showEditComponent = () => {
    setEditPost(!editPost);
  };
  const posts = useSelector((state) => state.user.userProfileData.posts);
  let index = posts.findIndex((post) => post._id === postNumber);
 
  let renderHeartIcon = () => {
    if (!posts[index].likes.includes(_id)) {
      like !== "add" && setLike("add")
      return <FaHeart />;
    } else {
      like !== "" && setLike("")
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

	const handleLike = () => {
    dispatch(newLikeUserProfile(postNumber, _id,like));
	   if(loggedUser._id !== userId){
		dispatch(postNotification({
		  type:'postLike',
		  refId: postNumber,
		  fromId: loggedUser._id,
		  toId: userId,
		  username: loggedUser.username,
		  profilePicture: loggedUser.profilePicture
		}))
	  }
	}
	const handleDislike = () => {
		dispatch(newDislikeUserProfile(postNumber,_id,dislike));
	}
	      
  let renderHeartBrokenIcon = () => {
    if (!posts[index].dislikes.includes(_id)) {
      //console.log("Entra blanco");
      dislike !== "add" && setDislike("add")
      return <ImHeartBroken />;
    } else {
      //console.log("Entra rojo");
      dislike !== "" && setDislike("")
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
  let renderEditPost = () => {
    if (editPost) {
      return (
        <EditPost
          userId={userId}
          postNumber={postNumber}
          content={content}
          showEditComponent={showEditComponent}
        />
      );
    }
  };

  let renderLikes = () => {
    setShowLikes(!showLikes)
    dispatch(listLikes(postNumber)) 
    //dispatch(ClearList())      
  };
  let renderDislikes = () => {
    setShowDislikes(!showDislikes);
    dispatch(listDislikes(postNumber)) 
  };
  const handleClose = () => {
    showLikes !== false && setShowLikes(false);
    showDislikes !== false && setShowDislikes(false);
    dispatch(clearAll());
  }

  return (
    <Fragment key={postNumber}>
      <div className="profile-posts-component md:p-7 p-3 md:flex  w-70  max-w-screen-lg  text-white">
        <div className="user-post__info">
          <Link to={`/home/profile/${userId}`}>
            {props.profilePicture ? (
              <Avatar imgUrl={props.profilePicture} size="xl" />
            ) : (
              <Avatar size="xl" />
            )}
          </Link>
          <div className="user-post-info__detalle">
            <Link
              to={`/home/profile/${userId}`}
              className="profile-posts-component-outside-div"
            >
              <div className="">{fullname ? fullname : "Dummy username"}</div>
            </Link>
            <div className=" text-stone-400 ">{timeAgo ? timeAgo : "Some time ago"}</div>
            

          </div>
          {loggedUser._id === userId && renderEditPost()}
        </div>
        <Link 
        to={`/home/post/${postNumber}`}
        className="hover:bg-[#353535]  flex flex-col items-center rounded-md"
        >
          <div className="user-post-profile__content flex-1 pl-2 md:pl-4 ">
            <div className="">
             

              {
                showMore.length > 500 ?  
                <p>{showMore.substring(0,500)}... {<span className="text-green-600 ">View more</span>}</p> 
                :
                <p>{props.content} </p> 

              }
            </div>
          </div>
            {multimedia ? <MultimediaElement source={multimedia} /> : null}
          
        </Link>
        <div className="actions flex gap-3 justify-end mt-2 md:mt-4 text-lg">
          <Link to={`/home/post/${postNumber}`}>
            <button className="flex items-center gap-1">
              <FaComment />
              {commentsLength}
            </button>
          </Link>

          <button className="flex items-center gap-1" onClick={handleLike}>
            {posts && renderHeartIcon()}
          </button>
          <button onClick={renderLikes}>
            {posts && posts[index].likes.length}
          </button>
          <button className="flex items-center gap-1" onClick={handleDislike}>
            {posts && renderHeartBrokenIcon()}
          </button>
          <button onClick={renderDislikes}>
            {posts && posts[index].dislikes.length}
          </button>

          {loggedUser._id !== userId ? (
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
                      makeReport(_id, props.postNumber, {
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
              {/* {post && renderHeartBrokenIcon()} */}
            </button>
          ) : null}
        </div>
        {loggedUser._id === userId && (
            <button className="user-post-icon_more" onClick={showEditComponent}>
              <AiOutlineMore />
            </button>
          )}
      </div>
      {showLikes === true && ( 
        <ListOfUsersRenderer titleToRender={'likes'} postId={postNumber} closeRenderFunction={handleClose} />
      )}
      {showDislikes === true && isPremium === true ? (
        <ListOfUsersRenderer
          titleToRender={'dislikes'}
          postId={postNumber}
          closeRenderFunction={handleClose}
        />
      ) : null}
    </Fragment>
  );
};

export default ProfilePosts;
