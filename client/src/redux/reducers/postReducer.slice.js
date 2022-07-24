import { createSlice } from '@reduxjs/toolkit'

const initialState ={
    postDetail: {_id: ''},
    likes: [],
    dislikes: []
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
           state.likes = action.payload
        },
        dislikesPost(state,action){
           state.dislikes = action.payload
        },
    }
})


export const {
    addPostDetail,
    removePostDetail,
    likesPost,
    dislikesPost
} = postReducer.actions


export default postReducer.reducer
