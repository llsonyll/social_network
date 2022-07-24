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
      if(!state.homePostsData.length || state.homePostsData[0]._id !== action.payload[0]._id){
       state.homePostsData = state.homePostsData.concat(action.payload);
      }else{
        state.homePostsData = action.payload;
      }
    }
  },
});

export const { userProfile, homePosts } = userReducer.actions;

export default userReducer.reducer;
