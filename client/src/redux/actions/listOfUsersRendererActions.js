import { clearList, dislikesPost, likesPost } from "../reducers/listOfUsersRenderer.slice";
import { apiConnection } from "../../utils/axios";


export const listLikes = (postId) => async(dispatch) => {
    try {
      const { data } = await apiConnection(`post/likes/${postId}`);
      //console.log(data)
      dispatch(likesPost( data ))
    } catch (err) {
      //console.log(err);
    }
};

export const listDislikes = (postId) => async(dispatch) => {
  try {
    const { data } = await apiConnection(`post/dislikes/${postId}`);
    console.log(data)
    dispatch(dislikesPost(data))
  } catch (err) {
    console.log(err);
  }
};

export const clearAll = () => (dispatch) => {
   dispatch(clearList())
}
