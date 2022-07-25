import { addPostDetail } from "../reducers/postReducer.slice";
import { apiConnection } from "../../utils/axios";

export const createComment = (userId, postId, info) => async (dispatch) => {
  try {
    // const { data } = await apiConnection.post(
    //   `comment/${userId}/${postId}`,
    //   info,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const { data } = await apiConnection.post(
      `comment/${userId}/${postId}`,
      info
    );

    return dispatch(addPostDetail(data));
  } catch (error) {
    console.log(error);
  }
};
