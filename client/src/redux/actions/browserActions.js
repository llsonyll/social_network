import { browser, errorBrowser } from "../reducers/browserReducers.slice";
import { apiConnection } from "../../utils/axios";

export const browserAction = (data) => async (dispatch) => {
  try {
    const { data: resData } = await apiConnection.get(`user/browser/${data}`);
    return dispatch(browser(resData));
  } catch (err) {
    if (err.response.status === 404 || err.response.status === 400) {
      dispatch(errorBrowser(err.response.data.err));
    }
  }
};
