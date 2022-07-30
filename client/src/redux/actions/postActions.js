import { addNewPost, addNewPostProfile } from "../reducers/userReducer.slice";
import {
  addPostDetail,
  likesPost,
  dislikesPost,
  likesComment,
} from "../reducers/postReducer.slice";
import { apiConnection } from "../../utils/axios";

export const getPost = (postId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.get(`post/${postId}`);

    return dispatch(addPostDetail(data));
  } catch (err) {
    console.log(err);
  }
};

export const createPost = (content, userId, path) => async (dispatch) => {
  try {
    const { data } = await apiConnection.post(`post/${userId}`,  content );

    if (path === "/home") {
      return dispatch(addNewPost(data));
    } else if (path === `/home/profile/${userId}`) {
      return dispatch(addNewPostProfile(data));
    } else return;
  } catch (err) {
    console.log(err);
  }
};

export const newlikePostTitle = (postId, userId) => async (dispatch) => {
  try {
    const {
      data: { likes, dislikes },
    } = await apiConnection.put(`post/like/${postId}/${userId}`);
    console.log(likes)
    dispatch(likesPost(likes));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikesPostTitle = (postId, userId) => async (dispatch) => {
  try {
    const {
      data: { dislikes, likes },
    } = await apiConnection.put(`post/dislike/${postId}/${userId}`);
    console.log(dislikes, likes);
    dispatch(dislikesPost({dislikes,likes}));
  } catch (err) {
    console.log(err);
  }
};

export const newLikesComment = (commentId, userId) => async (dispatch) => {
  try {
    const {
      data: { _id, likes },
    } = await apiConnection.put(`comment/like/${commentId}/${userId}`);
    dispatch(likesComment({ _id, likes }));
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (userId, postId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.delete(`post/${userId}/${postId}`);

    //return dispatch(addPostDetail(data));
  } catch (err) {
    console.log(err);
  }
};

export const editPost = (userId, postId, content) => async (dispatch) => {
  try {
    const { data } = await apiConnection.put(`post/${userId}/${postId}`, content);

    return dispatch(addPostDetail(data));
  } catch (err) {
    console.log(err);
  }
};
