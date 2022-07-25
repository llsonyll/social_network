import { userProfile, homePosts } from "../reducers/userReducer.slice";
import { apiConnection } from "../../utils/axios";

export const getUserProfile = (id) => async (dispatch) => {
  try {
    // let res = await axios.get(`http://localhost:3001/user/${id}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });

    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const { data } = await authAPI.get(`user/${id}`);
    //   return dispatch(userProfile(data));
    // }

    const { data } = await apiConnection.get(`user/${id}`);
    return dispatch(userProfile(data));
  } catch (err) {
    console.log(err);
  }
};

export const getHomePosts = (id, page) => async (dispatch) => {
  //id del usuario por params y numero de pag por query. trae de a 20 posts
  try {
    // let res = await axios.get(
    //   `http://localhost:3001/user/home/${id}?page=${page}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );

    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const { data } = await authAPI.get(`user/home/${id}?page=${page}`);
    //   return dispatch(homePosts(data));
    // }

    const { data } = await apiConnection.get(`user/home/${id}?page=${page}`);
    return dispatch(homePosts(data));
  } catch (err) {
    console.log(err);
  }
};

export const newLikeHomePost = (postId, userId, page) => async (dispatch) => {
  try {
    // let res = await axios.put(
    //   `http://localhost:3001/post/like/${postId}/${userId}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );

    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const res = await authAPI.put(`post/like/${postId}/${userId}`);
    //   console.log(res);
    //   dispatch(getHomePosts(userId, page));
    // }

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
      // let res = await axios.put(
      //   `http://localhost:3001/post/like/${postId}/${userId}`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );

      // const token = localStorage.getItem("token");
      // if (token) {
      //   const authAPI = createAuthInstanceAPI(token);
      //   const res = await authAPI.put(`post/like/${postId}/${userId}`);
      //   console.log(res);
      //   dispatch(getHomePosts(userId, page));
      // }

      const res = await apiConnection.put(`post/like/${postId}/${userId}`);
      console.log(res);
      dispatch(getHomePosts(userId, page));
    } catch (err) {
      console.log(err);
    }
  };

export const newLikeUserProfile = (postId, userId) => async (dispatch) => {
  try {
    // let res = await axios.put(
    //   `http://localhost:3001/post/like/${postId}/${userId}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const { data } = await authAPI.put(`post/like/${postId}/${userId}`);
    //   dispatch(userProfile(data.userPost));
    // }
    const {
      data: { userPost },
    } = await authAPI.put(`post/like/${postId}/${userId}`);
    dispatch(userProfile(userPost));
  } catch (err) {
    console.log(err);
  }
};

export const newDislikeUserProfile = (postId, userId) => async (dispatch) => {
  try {
    // let res = await axios.put(
    //   `http://localhost:3001/post/like/${postId}/${userId}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const { data } = await apiConnection.put(`post/like/${postId}/${userId}`);
    //   dispatch(userProfile(data.userPost));
    // }

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
    // let res = await axios.put(`http://localhost:3001/user/${id}`, obj, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // const token = localStorage.getItem("token");
    // if (token) {
    //   const authAPI = createAuthInstanceAPI(token);
    //   const { data } = await authAPI.put(`user/${id}`, obj);
    //   return dispatch(userProfile(data));
    // }

    const { data } = await apiConnection.put(`user/${id}`, obj);
    return dispatch(userProfile(data));
  } catch (err) {
    console.log(err);
  }
};
