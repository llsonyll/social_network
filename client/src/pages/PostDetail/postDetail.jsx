import "./postDetail.css";

import { useEffect } from "react";
import PostTile from "../../components/PostTile";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../redux/actions/postActions";
import { useParams } from "react-router-dom";
import { removePostDetail } from "../../redux/reducers/postReducer.slice";

import LoadingSpinner from "../../components/LoadingSpinner";

const PostDetail = () => {
  const params = useParams();
  const { postDetail, loadingPostDetail: loading } = useSelector(
    (store) => store.post
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost(params.id));
    return () => dispatch(removePostDetail());
  }, []);

  return (
    <div id="post-detail_container" className="flex-1 flex p-3 md:p-11 gap-8 bg-[#2e2e2e]">
      <div className="bg-stone-800 flex flex-col flex-1 md:basis-4/5 md:p-6 p-3 rounded-md max-w-5xl m-auto">
        {!loading ? <PostTile post={postDetail} /> : <LoadingSpinner />}
      </div>
    </div>
  );
};

export default PostDetail;
