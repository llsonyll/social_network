import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reports: []
};


const reportReducer = createSlice({
    name: "report",
    initialState,
    reducers: {
      getReports(state, action) {
        state.reports = action.payload
      }
    }
  });
  
  export const {
    getReports
  } = reportReducer.actions;
  
  export default reportReducer.reducer;
  