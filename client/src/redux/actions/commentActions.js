import { addPostDetail } from "../reducers/postReducer.slice";
import { apiConnection } from "../../utils/axios";
import Swal from 'sweetalert2'
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
    Swal.fire({
      icon: "success",
      title: "Good job!",
      text: 'Comment edit successfully',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = (userId, postId, commentId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.delete(
      `comment/${userId}/${postId}/${commentId}`
    
    );
    Swal.fire({
      icon: "info",
      title: ":(",
      text: 'Comment delete successfully',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};
