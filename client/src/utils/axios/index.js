import axios from "axios";
// import { dummyInterceptor } from "./interceptors";

//const DEV_URL = "https://dreamteamapi.herokuapp.com/"; // DEPLOY
//const DEV_URL = "https://www.dream-team-api.social/"; // DEPLOY
const DEV_URL = "http://localhost:3001/"
// const DEV_URL = "https://back.socialn.me/"; // DEV
const timeout = 5000;

export const apiConnection = axios.create({
  baseURL: DEV_URL,
  timeout,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`
  },
   withCredentials: true
});

apiConnection.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token') ?? ''}`;
    config.withCredentials = true;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const setAuthorization = (token) =>
  (apiConnection.defaults.headers.common["Authorization"] = `Bearer ${token}`);
