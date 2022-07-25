import axios from "axios";

const API_URL = "https://dreamteamapi.herokuapp.com/";
const timeout = 5000;

export const apiConnection = axios.create({
  baseURL: API_URL,
  timeout,
});

// apiConnection.interceptors.request.use((config) => {
//   console.log("AXIOS INTERCEPTOR", config);
// });

export const setAuthorization = (token) =>
  (apiConnection.defaults.headers.common["Authorization"] = `Bearer ${token}`);
