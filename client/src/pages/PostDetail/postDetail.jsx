import "./postDetail.css";

import { useEffect } from "react";
import FriendPostTile from "../../components/FriendPostTile";
import PostTile from "../../components/PostTile";
import { dummyFriendPost } from "../../data/dummyPostFriend";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../redux/actions/postActions";
import { useParams } from "react-router-dom";
import { removePostDetail } from "../../redux/reducers/postReducer.slice";

const PostDetail = () => {

  const params = useParams()
  const postDetail = useSelector((store) => store.post.postDetail)
  const containerStyle = {
    backgroundColor: "#2e2e2e",
  };

  const dispatch = useDispatch()

  useEffect(() => {
    console.log("Component Mounted", postDetail);
    dispatch(getPost(params.id))
    return (() => dispatch(removePostDetail()))
  }, []);

  return (
    <div className="flex-1 flex p-3 md:p-11 gap-8" style={containerStyle}>
      <div className="bg-stone-800 hidden md:flex basis-1/5 p-6 flex-col items-center rounded-md">
        <div className="text-white font-normal text-xl mb-4"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
      <div className="bg-stone-800 flex-1 md:basis-4/5 md:p-6 p-3 rounded-md">
        {postDetail._id? <PostTile post={postDetail}/> : <PostTile/>}
      </div>
    </div>
  );
};

export default PostDetail;
