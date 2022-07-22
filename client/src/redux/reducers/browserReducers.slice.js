import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searches: [],
};

const browserReducer = createSlice({
  name: "browser",
  initialState,
  reducers: {
    browser(state, action) {
      state.searches.push(action.payload);
    },
  },
});

export const { browser } = browserReducer.actions;

export default browserReducer.reducer;
