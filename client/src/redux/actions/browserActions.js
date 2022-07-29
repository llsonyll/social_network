import { browser, errorBrowser, cleanUp, updateLoading } from "../reducers/browserReducers.slice";
import { apiConnection } from "../../utils/axios";

export const browserAction = (data) => async (dispatch) => {
  dispatch(updateLoading(true));

  try {
    const { data: resData } = await apiConnection.get(`user/browser/${data}`);
    dispatch(updateLoading(false));

    if (resData.length > 5) {
      const firstFive = resData.slice(0, 5);
      localStorage.setItem('recentSearch', JSON.stringify(firstFive));
    } else {
      localStorage.setItem('recentSearch', JSON.stringify(resData));
    }

    return dispatch(browser(resData));
  } catch (err) {
    if (err.response.status === 404 || err.response.status === 400) {
      dispatch(updateLoading(false));
      dispatch(errorBrowser(err.response.data.err));
    }
  }
};

export const browserCleanUp = () => {
  return cleanUp();
};
