import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./reducers/authReducer.slice";
import browserReducer from "./reducers/browserReducers.slice";
import reviewReducer from "./reducers/reviewReducer";

const store = configureStore({
  reducer: {
    auth: authReducerSlice,
    browserReducer,
    review: reviewReducer,
  },
});

export default store;
