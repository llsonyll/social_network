import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfileData: {},
    homePostsData: [],
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    userProfile(state, action) {
      state.userProfileData = action.payload;
    },
    homePosts(state,action){
       state.homePostsData = state.homePostsData.concat(action.payload);
    },
    addNewPost(state, action){
      state.homePostsData = [action.payload, ...state.homePostsData]
    }
  },
});

export const { userProfile, homePosts, addNewPost } = userReducer.actions;

export default userReducer.reducer;