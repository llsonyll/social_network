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
       LikesPost(state,{payload}){
           state.likesPost = payload;
       },
       DislikesPost(state,{payload}){
        state.dislikesPost = payload;
       },
       clearList(state, {payload}){ //no funciona :( 
        state.likesPost = payload,
        state.dislikes = payload,
        state.followers = payload,
        state.following = payload
       },
    }
  });
  
  export const {
     clearList,
     LikesPost,
     DislikesPost
  } = listOfUsersRenderer.actions;
  
  export default listOfUsersRenderer.reducer;
