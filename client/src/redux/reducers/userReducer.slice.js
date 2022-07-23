import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfileData: {},
    userPostsData: [],
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    userProfile(state, action) {
      state.userProfileData = action.payload;
    },
    homePosts(state,action){
       state.homePostsData = action.payload;
    }
  },
});

export const { userProfile, homePosts } = userReducer.actions;

export default userReducer.reducer;