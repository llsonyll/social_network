import axios from "axios";

const API_URL = "http://dreamteamapi.herokuapp.com/";
const timeout = 5000;

export const apiConnection = axios.create({
  baseURL: API_URL,
  timeout,
});

export const setAuthorization = (token) =>
  (instance.defaults.headers.common["Authorization"] = `Bearer ${token}`);
