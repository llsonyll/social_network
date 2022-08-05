import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfileData: {},
  homePostsData: [],
  control: "true",
  userFollowings: [],
  loadingProfile: true,
  errorProfile: false,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    userProfile(state, action) {
      state.userProfileData = action.payload;
    },
    homePosts(state, action) {
      console.log("HOME POSTS REDUCER", action.payload)
        if (action.payload.length === 0 && state.control==="false") {
          state.control = ""
          return state
          console.log("CONTROL = VACIO ")
        }
        if (!state.homePostsData.length || state.homePostsData[state.homePostsData.length - 1]._id !== action.payload[action.payload?.length - 1]._id) {
          state.homePostsData = state.homePostsData.concat(action.payload);
          if (action.payload.length < 10 && state.control === "true") {
            state.control = "false"
          }
        }
    },
    clearHomePosts(state, action) {
      state.homePostsData = [],
      state.control = "true"
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
      state.userProfileData.followers = action.payload.followers;
      state.userProfileData.followRequest = action.payload.followRequest;
    },
    likesPost({homePostsData}, { payload }) {
      let index = homePostsData.findIndex(post => post._id === payload.postId)
      if(homePostsData[index].dislikes.includes(payload.userId)){ 
        homePostsData[index].dislikes = homePostsData[index].dislikes.filter(_id => _id !== payload.userId);
     }
     if(homePostsData[index].likes.includes(payload.userId)){
        homePostsData[index].likes = homePostsData[index].likes.filter(_id => _id !== payload.userId);
     }else{
        homePostsData[index].likes.push(payload.userId);
     }
    },
    dislikesPost({homePostsData}, { payload }) {
      let index = homePostsData.findIndex(post => post._id === payload.postId)
      if(homePostsData[index].likes.includes(payload.userId)){ 
        homePostsData[index].likes = homePostsData[index].likes.filter(_id => _id !== payload.userId);
     }
     if(homePostsData[index].dislikes.includes(payload.userId)){
        homePostsData[index].dislikes = homePostsData[index].dislikes.filter(_id => _id !== payload.userId);
     }else{
        homePostsData[index].dislikes.push(payload.userId);
     }
    },
    likesProfilePost({userProfileData}, { payload }) {
      let index = userProfileData.posts.findIndex(post => post._id === payload.postId)
      if(userProfileData.posts[index].dislikes.includes(payload.userId)){ 
        userProfileData.posts[index].dislikes = userProfileData.posts[index].dislikes.filter(_id => _id !== payload.userId);
     }
     if(userProfileData.posts[index].likes.includes(payload.userId)){
        userProfileData.posts[index].likes = userProfileData.posts[index].likes.filter(_id => _id !== payload.userId);
     }else{
        userProfileData.posts[index].likes.push(payload.userId);
     }
    },
    dislikesProfilePost({userProfileData}, { payload }) {
      let index = userProfileData.posts.findIndex(post => post._id === payload.postId)
      if(userProfileData.posts[index].likes.includes(payload.userId)){ 
        userProfileData.posts[index].likes = userProfileData.posts[index].likes.filter(_id => _id !== payload.userId);
     }
     if(userProfileData.posts[index].dislikes.includes(payload.userId)){
        userProfileData.posts[index].dislikes = userProfileData.posts[index].dislikes.filter(_id => _id !== payload.userId);
     }else{
        userProfileData.posts[index].dislikes.push(payload.userId);
     }
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
    },
    editUserPosts(state, { payload }) {
      let index = state.userProfileData.posts.findIndex(post => post._id === payload.postId);
      state.userProfileData.posts[index] = payload.post;
    },
    deletePostsGeneral(state, { payload }) {
      let filter = state.userProfileData.posts.filter(post => post._id !== payload.postId);
      state.userProfileData.posts = filter;
    },
    setLoadingProfile(state, action) {
      state.loadingProfile = action.payload;
    },
    setProfileError(state, { payload }) {
      state.errorProfile = payload
    }
  }
});

export const {
  deletePostsGeneral,
  editUserPosts,
  userProfile,
  homePosts,
  addNewPost,
  addNewPostProfile,
  clearProfileData,
  toggleFollowUser,
  toggleResponseFollow,
  likesProfilePost,
  likesPost,
  dislikesPost,
  dislikesProfilePost,
  toggleUSERFollowing,
  clearHomePosts,
  setLoadingProfile,
  setProfileError
} = userReducer.actions;

export default userReducer.reducer;
