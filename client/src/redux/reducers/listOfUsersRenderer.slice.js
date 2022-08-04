import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   likesPost:[],
   dislikesPost:[],
   follow:[],
   following:[]
};


const listOfUsersRenderer = createSlice({
    name: "listOfUsersRenderer",
    initialState,
    reducers: {
       LikesPost(state,{payload}){
           state.likesPost = payload.likes;
       },
       DislikesPost(state,{payload}){
        state.dislikesPost = payload.dislikes;
       },
       clearList(state, action){
        state.likesPost = [],
        state.dislikes = [],
        state.follow = [],
        state.following = []
       },
    }
  });
  
  export const {
     clearList,
     LikesPost,
     DislikesPost
  } = listOfUsersRenderer.actions;
  
  export default listOfUsersRenderer.reducer;
