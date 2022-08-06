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
       clearList(state, {payload}){ //no funciona :( 
        console.log("limpiar")
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
     dislikesPost
  } = listOfUsersRenderer.actions;
  
  export default listOfUsersRenderer.reducer;
