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

//lA RUTA NECESITA UN ID DE UN ADMIN, SI NO SE LE PASA ASI NO FUNCIONA
export const getReportsAction = (adminId, type) => async (dispatch) => {
  !type ? type = "" : null
try {
  const response = await apiConnection.get(`report/${adminId}?type=${type}`);
  return dispatch(getReports(response.data))
} catch (err) {
  console.log(err);
}
};

// ------------- ELIMINA COMENTARIO, POST O USUARIO REPORTADO ----------------------
export const deleteReported = (userId, reportId, type) => async (dispatch) => {
  try {
    const { data } = await apiConnection.put(`report/${userId}/${reportId}`, type);
    Swal.fire({
      icon: "info",
      title: 'Report deleted successfully',
      text: 'Thanks!',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(getReports(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups... Something went wrong",
      text: error.response.data,
      background: "#4c4d4c",
      color: "white",
    });
    return error.response.data;
  }
};

// --------------- CIERRA EL REPORTE Y ELIMINA A LOS ASOCIADOS ----------------------
export const closeReport = (userId, reportId, type) => async (dispatch) => {
  try {
    console.log('ola',type);
    const { data } = await apiConnection.delete(`report/${userId}/${reportId}`, {data: {type}});
    Swal.fire({
      icon: "info",
      title: 'Report close',
      text: 'Thanks!',
      background: "#4c4d4c",
      color: "white",
    });
    return dispatch(getReports(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups... Something went wrong",
      text: error.response.data,
      background: "#4c4d4c",
      color: "white",
    });
    return error.response.data;
  }
};
