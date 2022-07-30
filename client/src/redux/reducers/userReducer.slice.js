import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfileData: {},
  homePostsData: [],
  control: true,
  userFollowings : []
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    userProfile(state, action) {
      state.userProfileData = action.payload;
    },
    homePosts(state, action) {
      if (!state.homePostsData.length || state.homePostsData[0]._id !== action.payload[0]._id) {
        state.homePostsData = state.homePostsData.concat(action.payload);
      } else {
        state.homePostsData = action.payload;
      }
      if (action.payload.length === 0) {
        state.control = false
      }
    },
    addNewPost(state, action) {
      state.homePostsData = [action.payload, ...state.homePostsData]
    },
    addNewPostProfile(state, action) {
      if (state.homePostsData.length) {
        state.homePostsData = [action.payload, ...state.homePostsData]
      }
      state.userProfileData.posts = [action.payload, ...state.userProfileData.posts]
    },
    clearProfileData(state, action) {
      state.userProfileData = {}
    },
    toggleFollowUser(state, action) {
      state.userProfileData.followers = action.payload;
    },
    toggleUSERFollowing(state, action) {
      state.userFollowings = action.payload;
    },
    toggleResponseFollow(state, action) {
      state.userProfileData.followRequest = action.payload.followRequest;
      state.userProfileData.followers = action.payload.followers;
    },
    deleteAccount(state, action) {
      state.userProfileData = [];
    }
  },
});

export const {
  userProfile,
  homePosts,
  addNewPost,
  addNewPostProfile,
  clearProfileData,
  toggleFollowUser,
  toggleResponseFollow,
  toggleUSERFollowing
} = userReducer.actions;

export default userReducer.reducer;
