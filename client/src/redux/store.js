import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./reducers/authReducer.slice";
import browserReducer from "./reducers/browserReducers.slice";
import reviewReducer from "./reducers/reviewReducer";
import postReducerSlice from './reducers/postReducer.slice';
import userReducerSlice from "./reducers/userReducer.slice";
import chatReducer from "./reducers/chatReducer";
import notificationReducerSlice from "./reducers/notificationReducer.slice";

const store = configureStore({
  reducer: {
    auth: authReducerSlice,
    browserReducer,
    review: reviewReducer,
	  post: postReducerSlice,
    user: userReducerSlice,
    chat: chatReducer,
    notification: notificationReducerSlice
  },
});

export default store;
