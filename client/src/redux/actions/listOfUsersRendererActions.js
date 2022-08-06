import { clearList, dislikesPost, followersUser, likesPost } from "../reducers/listOfUsersRenderer.slice";
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


export const following = (userId) => async(dispatch) => {
  try {
     const{ data: { following } } = await apiConnection(`user/following/${userId}`)
     dispatch(followingUser({following}));
  } catch (err) {
    console.log(err);
  }
}; 

export const followers = (userId) => async(dispatch) => {
     try {
        const{ data: { followers } } = await apiConnection(`user/followers/${userId}`)
        dispatch(followersUser({followers}));
     } catch (err) {
       console.log(err);
     }
}; 

export const clearAll = () => (dispatch) => {
   dispatch(clearList())
}
