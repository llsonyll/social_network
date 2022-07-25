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
    // let res = await axios.post(
    //   "http://localhost:3001/post/" + userId,
    //   { content: content },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );

    const { data } = await apiConnection.post(`post/${userId}`, { content });

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
      data: { likes },
    } = await apiConnection.put(`post/like/${postId}/${userId}`);
    dispatch(likesPost(likes));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikesPostTitle = (postId, userId) => async (dispatch) => {
  try {
    // let res = await axios.put(
    //   `http://localhost:3001/post/likes/${postId}/${userId}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const {
      data: { dislikes },
    } = await apiConnection.put(`post/likes/${postId}/${userId}`);
    dispatch(likesPost(dislikes));
  } catch (err) {
    console.log(err);
  }
};

export const newLikesComment = (commentId, userId) => async (dispatch) => {
  try {
    // let res = await axios.put(
    //   `http://localhost:3001/comment/like/${commentId}/${userId}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const {
      data: { _id, likes },
    } = await apiConnection.put(`comment/like/${commentId}/${userId}`);
    dispatch(likesComment({ _id, likes }));
  } catch (err) {
    console.log(err);
  }
};
