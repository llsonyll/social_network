import { DislikesPost, likes, LikesPost } from "../reducers/listOfUsersRenderer.slice";
import { apiConnection } from "../../utils/axios";


export const listLikes = (postId) => async(dispatch) => {
    try {
      const { data } = await apiConnection(`/likes/${postId}`);
      dispatch(LikesPost({ likes: data }))
    } catch (err) {
      console.log(err);
    }
};

export const listDislikes = (postId) => async(dispatch) => {
  try {
    const { data } = await apiConnection(`/dislikes/${postId}`);
    dispatch(DislikesPost({ dislikes: data }))
  } catch (err) {
    console.log(err);
  }
};
