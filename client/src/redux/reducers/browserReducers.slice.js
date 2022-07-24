import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searches: [],
  error: "",
};

const browserReducer = createSlice({
  name: "browser",
  initialState,
  reducers: {
    browser(state, action) {
      state.searches = [...action.payload];
    },
    errorBrowser(state,action){
       state.error = action.payload;
       state.searches = [];
       console.log(action.payload)
    }
  },
});

export const { browser, errorBrowser } = browserReducer.actions;

export default browserReducer.reducer;
