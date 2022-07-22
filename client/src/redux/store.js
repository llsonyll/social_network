import { configureStore } from "@reduxjs/toolkit";
import authReducerSlice from "./reducers/authReducer.slice";
import browserReducer from "./reducers/browserReducers.slice";

const store = configureStore({
  reducer: {
		auth: authReducerSlice,
    browserReducer,
  },
});

export default store;
