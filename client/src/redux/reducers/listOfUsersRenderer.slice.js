import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   likesPost:[],
   dislikesPost:[],
   followers:[],
   following:[]
};


const listOfUsersRenderer = createSlice({
    name: "listOfUsersRenderer",
    initialState,
    reducers: {
       likesPost(state,{payload}){
           state.likesPost = payload;
       },
       dislikesPost(state,{payload}){
        state.dislikesPost = payload;
       },
       followersUser(state,{payload}){
         state.followers = payload.followers;
       },
       followingUser(state,{payload}){
         state.following = payload.following;
       },
       clearList(state, {payload}){ //no funciona :( 
        state.likesPost = []
        state.dislikesPost = []
        state.followers = []
        state.following = []
       },
    }
  });
  
  export const {
     clearList,
     likesPost,
     dislikesPost,
     followersUser,
     followingUser,
  } = listOfUsersRenderer.actions;
  
  export default listOfUsersRenderer.reducer;
