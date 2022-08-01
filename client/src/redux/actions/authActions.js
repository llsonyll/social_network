import { loginUser } from "../reducers/authReducer.slice";
import axios from "axios";
import Swal from "sweetalert2";

import { apiConnection, setAuthorization } from "../../utils/axios";

export const loginAction = (obj) => async (dispatch) => {
  try {
    const {
      data: { token, username, _id, profilePicture, isDeleted, isPremium, isAdmin },
    } = await apiConnection.post("auth/login", obj);

    // if (obj.rememberMe) {
    localStorage.setItem("token", token);
    //}

    setAuthorization(token);
    return dispatch(
      loginUser({
        username: username,
        _id: _id,
        profilePicture: profilePicture,
        isDeleted: isDeleted,
        isAdmin: isAdmin,
        isPremium:  isPremium
      })
    );
  } catch (err) {
    console.log(err);
    Swal.fire({
      icon: "error",
      title: "Ups... Something went wrong",
      text: err.response.data,
      background: "#4c4d4c",
      color: "white",
    });
  }
};

export const registerAction = (obj) => async (dispatch) => {
  try {
    const {
      data: { token, username, _id, profilePicture, isDeleted, isPremium, isAdmin },
    } = await apiConnection.post("auth/register", obj);
    localStorage.setItem("token", token);
    setAuthorization(token);
    return dispatch(
      loginUser({
        username: username,
        _id: _id,
        profilePicture: profilePicture,
        isDeleted: isDeleted,
        isAdmin: isAdmin,
        isPremium:  isPremium
      })
    );
  } catch (err) {
    console.log(err);
    Swal.fire({
      icon: "error",
      title: "Ups... Something went wrong",
      text: err.response.data.message,
      background: "#4c4d4c",
      color: "white",
    });
  }
};

export const getLoggedUserInfo = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    setAuthorization(token);
    const {
      data: { username, _id, profilePicture, isDeleted, isPremium, isAdmin  },
    } = await apiConnection.post("auth");
    return dispatch(
      loginUser({
        username: username,
        _id: _id,
        profilePicture: profilePicture,
        isDeleted: isDeleted,
        isAdmin: isAdmin,
        isPremium:  isPremium
      })
    );
  } catch (err) {
    console.log(err);
  }
};
