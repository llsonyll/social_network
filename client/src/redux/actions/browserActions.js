import { browser, errorBrowser } from "../reducers/browserReducers.slice";
import { apiConnection } from "../../utils/axios";

export const browserAction = (data) => async (dispatch) => {
  try {
    // const { data } = await apiConnection.get(`user/browser/${data}`, null, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    const { data } = await apiConnection.get(`user/browser/${data}`);
    return dispatch(browser(data));
  } catch (err) {
    if (err.response.status === 404 || err.response.status === 400) {
      dispatch(errorBrowser(err.response.data.err));
    }
  }
};
