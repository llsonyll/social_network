// import { addPostDetail
// } from "../reducers/postReducer.slice";

import { apiConnection } from "../../utils/axios";

export const premiumSubscription = (userId, info) => async (dispatch) => {
    try {
        const response = await apiConnection.post(`/premium/${userId}`, info);
        return console.log(response.data);
    } catch (error) {
        console.log(error.response.data);
    }
};
