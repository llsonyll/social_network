import Swal from "sweetalert2";
import { apiConnection } from "../../utils/axios";
import { getReports } from "../reducers/reportReducer.slice";

export const makeReport = (userId, reportId, info) => async (dispatch) => {
  try {
    const response = await apiConnection.post(
      `report/${userId}/${reportId}`,
      info
    );
    Swal.fire({
      icon: "success",
      title: "Your report was sent successfully",
      text: response.data.msg,
      background: "#4c4d4c",
      color: "white",
    });
    return response;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups... Something went wrong",
      text: error.response.data.msg,
      background: "#4c4d4c",
      color: "white",
    });
    return error.response.data.msg;
  }
};

export const getReportsAction = (type) => async (dispatch) => {
    !type ? type = "" : null
  try {
    const response = await apiConnection.get(`report?type=${type}`);
    dispatch(getReports(response.data))
  } catch (err) {
    console.log(err);
  }
};
