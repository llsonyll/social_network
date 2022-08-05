import Swal from "sweetalert2";
import { userProfile
} from "../reducers/userReducer.slice";

import { apiConnection } from "../../utils/axios";

export const premiumSubscription = (userId, info) => async (dispatch) => {
    try {
        const { data } = await apiConnection.post(`/premium/${userId}`, info);
        Swal.fire({
            icon: "success",
            title: "You're premium now!!!",
            text: data.msg,
            background: "#4c4d4c",
            color: "white",
          });
        return data;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups... Something went wrong",
            text: error.response.data,
            background: "#4c4d4c",
            color: "white",
          });
        return console.log(error);
    }
};

export const privacityChange = (userId) => async (dispatch) => {
    try {
        const { data } = await apiConnection.put(`/premium/private/${userId}`);
        return dispatch(userProfile(data));
    } catch (error) {
        console.log(error);
    }
};
