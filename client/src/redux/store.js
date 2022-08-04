import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./reducers/authReducer.slice";
import browserReducer from "./reducers/browserReducers.slice";
import reviewReducer from "./reducers/reviewReducer";
import postReducerSlice from './reducers/postReducer.slice';
import userReducerSlice from "./reducers/userReducer.slice";
import chatReducer from "./reducers/chatReducer";
<<<<<<< HEAD
import notificationReducerSlice from "./reducers/notificationReducer.slice";
=======
import reportReducerSlice from "./reducers/reportReducer.slice";
>>>>>>> 106db5de0d2666234d9376104f74abc94c29d39f

const store = configureStore({
  reducer: {
    auth: authReducerSlice,
    browserReducer,
    review: reviewReducer,
	  post: postReducerSlice,
    user: userReducerSlice,
    chat: chatReducer,
<<<<<<< HEAD
    notification: notificationReducerSlice
=======
    report: reportReducerSlice
>>>>>>> 106db5de0d2666234d9376104f74abc94c29d39f
  },
});

export default store;
