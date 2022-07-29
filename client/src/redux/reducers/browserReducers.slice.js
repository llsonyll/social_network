import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searches: [],
  loading: true,
  error: "",
};

const browserReducer = createSlice({
  name: "browser",
  initialState,
  reducers: {
    browser(state, action) {
      state.searches = [...action.payload];
    },
    errorBrowser(state, action) {
      state.error = action.payload;
      state.searches = [];
      console.log(action.payload)
    },
    cleanUp(state, action) {
      state.searches = [];
      state.error = "";
    },
    updateLoading(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { browser, errorBrowser, cleanUp, updateLoading } = browserReducer.actions;

export default browserReducer.reducer;
