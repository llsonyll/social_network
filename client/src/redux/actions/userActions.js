import { userProfile, homePosts } from "../reducers/userReducer.slice";
import { followOrUnfollowSomeone } from "../reducers/userReducer.slice";
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

export const newDislikeHomePost =
  (postId, userId, page) => async (dispatch) => {
    try {
      const res = await apiConnection.put(`post/like/${postId}/${userId}`);
      console.log(res);
      dispatch(getHomePosts(userId, page));
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
      data: { userPost },
    } = await apiConnection.put(`post/like/${postId}/${userId}`);
    dispatch(userProfile(userPost));
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

export const followOrUnfollowUser = (idUsuario, idDelSeguido) => async (dispatch) => {
  //recibe Id del usuario y luego id del usuario a seguir por params 
 
    try {
      const { data } = await apiConnection.put(`user/follow/${idUsuario}/${idDelSeguido}`);
      return dispatch(followOrUnfollowSomeone(data));
    } catch (err) {
      console.log(err);
    }
  
};
