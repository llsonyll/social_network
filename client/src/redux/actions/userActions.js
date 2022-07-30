
import { logOutUser } from "../reducers/authReducer.slice";
import { userProfile, homePosts, dislikesPost, dislikesProfilePost, toggleUSERFollowing } from "../reducers/userReducer.slice";
import { toggleFollowUser, toggleResponseFollow } from "../reducers/userReducer.slice";
import { apiConnection } from "../../utils/axios";



export const getUserProfile = (id) => async (dispatch) => {
  try {
    const { data } = await apiConnection.get(`user/${id}`);
    return dispatch(userProfile(data));
  } catch (err) {
    console.log(err);
  }
};

export const getHomePosts = (id, page) => async (dispatch) => {
  //id del usuario por params y numero de pag por query. trae de a 20 posts
  try {
    const { data } = await apiConnection.get(`user/home/${id}?page=${page}`);
    return dispatch(homePosts(data));
  } catch (err) {
    console.log(err);
  }
};

export const newLikeHomePost = (postId, userId, page) => async (dispatch) => {
  try {
    const res = await apiConnection.put(`post/like/${postId}/${userId}`);
    console.log(res);
    dispatch(getHomePosts(userId, page));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikeHomePost =(postId, userId) => async (dispatch) => {
    try {
      const { data: { dislikes, likes } } = await apiConnection.put(`post/dislike/${postId}/${userId}`);

      dispatch(dislikesPost({ dislikes, likes, postId }));
    } catch (err) {
      console.log(err);
    }
  };

export const newLikeUserProfile = (postId, userId) => async (dispatch) => {
  try {
    const {
      data: { userPost },
    } = await apiConnection.put(`post/like/${postId}/${userId}`);
    dispatch(userProfile(userPost));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikeUserProfile = (postId, userId) => async (dispatch) => {
  try {
    const {
      data: { likes, dislikes },
    } = await apiConnection.put(`post/dislike/${postId}/${userId}`);

     console.log(likes," ",dislikes);
    dispatch(dislikesProfilePost({likes,dislikes,postId}));
  } catch (err) {
    console.log(err);
  }
};

export const modifyUser = (id, obj) => async (dispatch) => {
  //recibe Id por params, y el obj va a ser la propiedad a modificar
  try {
    const { data } = await apiConnection.put(`user/${id}`, obj);
    return dispatch(userProfile(data));
  } catch (err) {
    console.log(err);
  }
};

export const restorePassword = async (email) => {
  try {
    const { data } = await apiConnection.post(`user/restorePassword`, { email: email });
    console.log(data);
    return data;
  } catch (err) {
    return { error: err.response.data.error ?? 'Email provided does not belong to any registered user' }
  }
};

export const changePassword = (current, newPassword, userId) => async (dispatch) => {
  try {
    const { message, error } = await apiConnection.put(`user/updatePassword`, {
      oldPassword: current,
      newPassword: newPassword,
      userId: userId,
    });
  } catch (err) {
    console.log(err);
  }
}

export const followOrUnfollowUser = (userId, followUserId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a seguir por params
  try {
    // devuelve la lista de usuarios que sigen al perfil del seguido 
    const { data } = await apiConnection.put(`user/follow/${userId}/${followUserId}`);
    return dispatch(toggleFollowUser(data));
  } catch (err) {
    console.log(err);
  }
};
export const getUserFollowings = (userId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a seguir por params
  try {
    // devuelve la lista de usuarios que sigen al perfil del seguido 
    const { data } = await apiConnection.get(`user/following/${userId}`);
    return dispatch(toggleUSERFollowing(data));

    } catch (err) {
    console.log(err);
  }
};

// -------------- Action para aceptar solicitud de seguimiento ------------------
export const acceptFollowRequest = (userId, userRequestingId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a aceptar por params
  try {
    const { data } = await apiConnection.put(`user/acceptFollow/${userId}/${userRequestingId}`);
    return dispatch(toggleFollowUser(data));
  } catch (err) {
    console.log(err);
  }
};

// -------------- Action para cancelar solicitud de seguimiento ------------------
export const cancelFollowRequest = (userId, userRequestingId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a cancelar por params
  try {
    const { data } = await apiConnection.put(`user/cancelFollow/${userId}/${userRequestingId}`);
    return dispatch(toggleFollowUser(data));
} catch (err) {
  console.log(err);
}
};
export const deleteUser = (userId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a seguir por params
  try {
    // devuelve la lista de usuarios que sigen al perfil del seguido 
    const { data } = await apiConnection.put(`user/deleted/${userId}`);
    //console.log(data)
    console.log('Your account has been deleted.')
    localStorage.removeItem('token')
    dispatch(logOutUser())
  } catch (err) {
    console.log(err);
  }
};


