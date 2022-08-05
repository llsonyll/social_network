import Avatar from "../Avatar";
import { FaHeart, FaExclamation } from "react-icons/fa";
import { AiOutlineMore } from "react-icons/ai";
import { IconContext } from "react-icons";
import { ImHeartBroken } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { newDislikesComment, newLikesComment } from "../../redux/actions/postActions";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

import './commentTile.css'
import { useState } from "react";
import EditComment from "../editComment/editComment";
import { makeReport } from "../../redux/actions/reportActions";
import Swal from "sweetalert2";
import { postNotification } from "../../redux/actions/notificationActions";


const CommentTile = ({ data , props }) => {
  // const handleReplyComment = () => {
  //   console.log("Reply Comment");
  // };
  const[editComents, setEditComments] = useState(false)
  const loggedUser = useSelector(store => store.auth.loggedUser)

  console.log(editComents);
  console.log(data);

  const { _id } = useSelector((state) => state.auth.loggedUser);
  const dispatch = useDispatch();

  const handleLikeComment = () => {
    dispatch(newLikesComment(data._id, _id));
    if(loggedUser._id !== data.userId._id){
      dispatch(postNotification({
        type:'commentLike',
        refId: data.postId,
        fromId: loggedUser._id,
        toId: data.userId._id,
        username: loggedUser.username,
        profilePicture: loggedUser.profilePicture
      }))
    }
  };

  const handleDislikeComment = ()  => {
     dispatch(newDislikesComment(data._id, _id))
  }

  let renderHeartIcon = () => {
    if (!data.likes.find( like => like._id === _id)) {
      return <FaHeart />;
    }else{
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
   console.log(data);
  let renderHeartBrokenIcon = () => {
    if (!data.dislikes.find( dislike => dislike._id === _id)) {
      console.log('Entra blanco');
      return <ImHeartBroken />
    }else{
      console.log('Entra rojo');
      return (
        <IconContext.Provider value={{ color: "#9400D3", className: 'global-heart-class-name' }}>
          <div>
            <ImHeartBroken />
          </div>
        </IconContext.Provider>
      )
    }
  }

  const renderChangeRenderComponents = (nameOfTheComponentToRender) => {
    if (nameOfTheComponentToRender === "editComment") {
      setEditComments(false);
    }
  };

  return data?.userId ? (
    <div>

    <div id="comment_container" className="bg-[#353535] rounded-md md:p-2 p-1 flex my-3">
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
        <div className="font-medium text-base relative">
          <Link to={`/home/profile/${data.userId._id}`}>
            {data ? data.userId?.username : "Username"}
          </Link>
          {
            loggedUser._id  === data.userId._id &&
          <button 
          className="icon_more"
          onClick={() => setEditComments(true)}
          >
            <AiOutlineMore />
          </button>
          }
        </div>
        <div  id="comment-content_container" className="font-light text-sm">
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
            {data && renderHeartIcon()} {data && data.likes.length }
          </button>
             <button
                className="flex items-center gap-1"
                onClick={handleDislikeComment}
              >
                  {data && renderHeartBrokenIcon()}
                {data && data.dislikes.length }
              </button>
          {_id !== data.userId?._id ?
            <button
            className="flex items-center gap-1"
            onClick={() => {
              Swal.fire({
                background: "#4c4d4c",
                color: "white",
                title: 'Submit your Report',
                input: 'textarea',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                preConfirm: (login) => {
                  dispatch(makeReport(_id, data._id, {reason: login, reported: 'comment'})) 
                },
                allowOutsideClick: () => !Swal.isLoading()
              })}}
          >
            <FaExclamation />
          </button>
        : null}
        </div>
      </div>
    </div>
      {editComents === true && 
        <EditComment
          renderChangeRenderComponents={renderChangeRenderComponents}
          data={data} 
          props={props}
        />
      }
    </div>
  ) : (
    <>      </>
  );
};

export default CommentTile;
