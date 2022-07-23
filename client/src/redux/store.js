import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./reducers/authReducer.slice";
import browserReducer from "./reducers/browserReducers.slice";
import reviewReducer from "./reducers/reviewReducer";
import postReducerSlice from './reducers/postReducer.slice';
import userReducerSlice from "./reducers/userReducer.slice";

const store = configureStore({
  reducer: {
    auth: authReducerSlice,
    browserReducer,
    review: reviewReducer,
	  post: postReducerSlice,
    user: userReducerSlice
  },
});

export default store;
