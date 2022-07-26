import axios from "axios";
// import { dummyInterceptor } from "./interceptors";

const API_URL = "https://dreamteamapi.herokuapp.com/";
const timeout = 5000;

export const apiConnection = axios.create({
  baseURL: API_URL,
  timeout,
});

export const setAuthorization = (token) =>
  (apiConnection.defaults.headers.common["Authorization"] = `Bearer ${token}`);
