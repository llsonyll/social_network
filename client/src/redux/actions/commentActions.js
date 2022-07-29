import { addPostDetail } from "../reducers/postReducer.slice";
import { apiConnection } from "../../utils/axios";

export const createComment = (userId, postId, info) => async (dispatch) => {
  try {
    const { data } = await apiConnection.post(
      `comment/${userId}/${postId}`,
      info
    );

    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};

export const editComment = (userId, postId, commentId, info) => async (dispatch) => {
  try {
    const { data } = await apiConnection.put(
      `comment/${userId}/${postId}/${commentId}`,
      info
    );

    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = (userId, postId, commentId, info) => async (dispatch) => {
  try {
    const { data } = await apiConnection.delete(
      `comment/${userId}/${postId}/${commentId}`,
      info
    );

    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};
