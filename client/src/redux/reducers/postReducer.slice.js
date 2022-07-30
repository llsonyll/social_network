import { createSlice } from '@reduxjs/toolkit'

const initialState ={
    postDetail: {_id: '',likes: "", dislikes: []},
}

const postReducer = createSlice({
    name: 'post',
    initialState,
    reducers:{
        addPostDetail(state, action){
            state.postDetail = action.payload
        },
        removePostDetail(state, action){
            state.postDetail = {_id: ''}
        },
        likesPost(state,action){
           state.postDetail.likes = action.payload
        },
        dislikesPost(state,action){
           state.postDetail.dislikes = action.payload
        },
        likesComment(state,{payload}){
              let index = state.postDetail.commentsId.findIndex(comment => comment._id === payload._id);
              state.postDetail.commentsId[index].likes = payload.likes;
        },
    }
})


export const {
    addPostDetail,
    removePostDetail,
    likesPost,
    dislikesPost,
    likesComment,
} = postReducer.actions


export default postReducer.reducer
