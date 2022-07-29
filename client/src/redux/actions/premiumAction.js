import { userProfile
} from "../reducers/userReducer.slice";

import { apiConnection } from "../../utils/axios";

export const premiumSubscription = (userId, info) => async (dispatch) => {
    try {
        const response = await apiConnection.post(`/premium/${userId}`, info);
        return console.log(response?.data);
    } catch (error) {
        console.log(error);
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
