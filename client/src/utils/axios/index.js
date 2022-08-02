import axios from "axios";
// import { dummyInterceptor } from "./interceptors";

// const DEPLOY_URL = "https://dreamteamapi.herokuapp.com/"; // DEPLOY
const DEV_URL = "http://localhost:3001/"; // DEV
const timeout = 5000;

export const apiConnection = axios.create({
  baseURL: DEV_URL,
  timeout,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
  }
});

export const setAuthorization = (token) =>
  (apiConnection.defaults.headers.common["Authorization"] = `Bearer ${token}`);
