
import { logOutUser } from "../reducers/authReducer.slice";
import { userProfile, homePosts, dislikesPost, toggleUSERFollowing, firstToggleUserFollowing, dislikesProfilePost, likesProfilePost, likesPost, setLoadingProfile, setProfileError } from "../reducers/userReducer.slice";
import { toggleFollowUser, toggleResponseFollow } from "../reducers/userReducer.slice";
import { apiConnection } from "../../utils/axios";
import Swal from "sweetalert2";
import { socket } from "../../App";
import { Navigate } from "react-router-dom";

export const getUserProfile = (id) => async (dispatch) => {
  try {
    // dispatch(setProfileError(false))
    dispatch(setLoadingProfile(true));
    const { data } = await apiConnection.get(`user/${id}`);
    console.log(data);
    dispatch(setLoadingProfile(false))
    dispatch(userProfile(data));
  } catch (err) {
    console.log(err ?? 'Error GetUserProfile');
    dispatch(setProfileError(true))
  }
};

export const getHomePosts = (id, page, control) => async (dispatch) => {
  //id del usuario por params y numero de pag por query. trae de a 10 posts
  try {
    const { data } = await apiConnection.get(`user/home/${id}?page=${page}&control=${control}`);
    return dispatch(homePosts(data));
  } catch (err) {
    console.log(err);
  }
};


export const newLikeHomePost = (postId, userId, like) => async (dispatch) => {
  try {
      apiConnection.put(`post/like/${postId}/${userId}?action=${like}`);
    dispatch(likesPost({  userId, postId }));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikeHomePost = (postId, userId, dislike) => async (dispatch) => {
  try {
      apiConnection.put(`post/dislike/${postId}/${userId}?action=${dislike}`);
    dispatch(dislikesPost({ userId, postId }));
  } catch (err) {
    console.log(err);
  }
};

export const newLikeUserProfile = (postId, userId, like) => async (dispatch) => {
  try {
      apiConnection.put(`post/like/${postId}/${userId}?action=${like}`)
    dispatch(likesProfilePost({ userId, postId }));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikeUserProfile = (postId, userId, dislike) => async (dispatch) => {
  try {
      apiConnection.put(`post/dislike/${postId}/${userId}?action=${dislike}`)    
    dispatch(dislikesProfilePost({ userId, postId }));
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
    const { data } = await apiConnection(`user/restorePassword?email=${email}`);
    return data;
  } catch (err) {
    return { error: err.response.data.error ?? 'Email provided does not belong to any registered user' }
  }
};

export const restoredNewPassword = (tokenRestore, password) => async (dispatch) => {
   try {
       await apiConnection.post(`user/restorePassword`,{ tokenRestore, password }); 
   } catch (err) {
     console.log(err);
   }
}

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
export const getUserFollowings = (userId, query, control) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a seguir por params
  !query ? query="" : null
  try {
    // devuelve la lista de usuarios que sigen al perfil del seguido 
    const { data } = await apiConnection.get(`user/browserFollowing/${userId}?users=${query}`);
    //console.log(data)
    if(control) {
      return dispatch(firstToggleUserFollowing(data))
    } else {
      return dispatch(toggleUSERFollowing(data));
    }

  } catch (err) {
    console.log(err);
  }
};

// -------------- Action para aceptar solicitud de seguimiento -----------------
export const acceptFollowRequest = (userId, userRequestingId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a aceptar por params
  try {
    const { data } = await apiConnection.put(`user/acceptFollow/${userId}/${userRequestingId}`);
    return dispatch(toggleResponseFollow(data));
  } catch (err) {
    console.log(err);
  }
};

// -------------- Action para cancelar solicitud de seguimiento ------------------
export const cancelFollowRequest = (userId, userRequestingId) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a cancelar por params
  try {
    const { data } = await apiConnection.put(`user/cancelFollow/${userId}/${userRequestingId}`);
    return dispatch(toggleResponseFollow(data));
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
    //console.log('Your account has been deleted.')
    localStorage.removeItem('token');
    socket.emit('logout', userId);
    dispatch(logOutUser());
  } catch (err) {
    console.log(err);
  }
};

