import Avatar from "../Avatar";
import { FaHeart } from "react-icons/fa";
import { AiOutlineMore } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { newLikesComment } from "../../redux/actions/postActions";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

import './commentTile.css'
import { useState } from "react";
import EditComment from "../editComment/editComment";


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

  const renderChangeRenderComponents = (nameOfTheComponentToRender) => {
    if (nameOfTheComponentToRender === "editComment") {
      setEditComments(false);
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
      {editComents === true && 
        <EditComment
          renderChangeRenderComponents={renderChangeRenderComponents}
          data={data} 
          props={props}
        />
      }
    </div>
  ) : (
    <></>
  );
};

export default CommentTile;
