import { addNewPost, addNewPostProfile, deletePostsGeneral, editUserPosts } from "../reducers/userReducer.slice";
import {
  addPostDetail,
  likesPost,
  dislikesPost,
  likesComment,
  dislikesComment,
  setLoadingPostDetail
} from "../reducers/postReducer.slice";
import { apiConnection } from "../../utils/axios";
import Swal from "sweetalert2";

export const getPost = (postId) => async (dispatch) => {
  try {
    dispatch(setLoadingPostDetail(true));
    const { data } = await apiConnection.get(`post/${postId}`);
    dispatch(addPostDetail(data));
    dispatch(setLoadingPostDetail(false));
    return { data };
  } catch (err) {
    return { error: err.message ?? 'error GetPost' }
  }
};

export const createPost = (content, userId, path) => async (dispatch) => {
  try {
    const { data } = await apiConnection.post(`post/${userId}`, content);
    if (path === "/home") {
      return dispatch(addNewPost(data));
    } else if (path === `/home/profile/${userId}`) {
      return dispatch(addNewPostProfile(data));
    } else return;
  } catch (err) {
    console.log(err);
  }
};

export const newlikePostTitle = (postId, userId, like) => async (dispatch) => {
  try {
      apiConnection.put(`post/like/${postId}/${userId}?action=${like}`)
      dispatch(likesPost({userId}));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikesPostTitle = (postId, userId, dislike) => async (dispatch) => {
  try {
      apiConnection.put(`post/dislike/${postId}/${userId}?action=${dislike}`);
     dispatch(dislikesPost({userId}));
  } catch (err) {
    console.log(err);
  }
};

export const newLikesComment = (commentId, userId) => async (dispatch) => {
  try {
    const {
      data: { _id, likes, dislikes },
    } = await apiConnection.put(`comment/like/${commentId}/${userId}`);
    dispatch(likesComment({ _id, likes, dislikes }));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikesComment = (commentId, userId) => async (dispatch) => {
  try {
    const {
      data: { _id, likes, dislikes },
    } = await apiConnection.put(`comment/dislike/${commentId}/${userId}`);
    dispatch(dislikesComment({ _id, likes, dislikes }));
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (userId, postId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.delete(`post/${userId}/${postId}`);
    //console.log(data)
    Swal.fire({
      icon: "info",
      title: ":(",
      text: 'Post delete successfully',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(deletePostsGeneral({ postId }));
  } catch (err) {
    console.log(err);
  }
};

export const editPost = (userId, postId, content) => async (dispatch) => {
  try {
    //console.log(userId,postId,content);
    const { data } = await apiConnection.put(`post/${userId}/${postId}`, content);
    Swal.fire({
      icon: "success",
      title: "Good job!",
      text: 'Post edit successfully',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(editUserPosts({ post: data, postId }));
  } catch (err) {
    console.log(err);
  }
};

