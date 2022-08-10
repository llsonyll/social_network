import { apiConnection } from "../../utils/axios";
import { 
    getInfo,
    getPayments
 } from "../reducers/adminReducer.slice";

export const getUsersInfo = (userId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.get(`admin/${userId}`);
    return dispatch(getInfo(data));
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentsInfo = (adminId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.get(`admin//payments/${adminId}`);
    return dispatch(getPayments(data));
  } catch (err) {
    console.log(err);
  }
};
