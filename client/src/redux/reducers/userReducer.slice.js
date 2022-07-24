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
    },
    addNewPostProfile(state, action){
      if(state.homePostsData.length){
        state.homePostsData = [action.payload, ...state.homePostsData]
      }
      state.userProfileData.posts = [action.payload, ...state.userProfileData.posts]
    }
  },
});

export const { userProfile, homePosts, addNewPost, addNewPostProfile } = userReducer.actions;

export default userReducer.reducer;