import { createSlice } from '@reduxjs/toolkit'

const initialState ={
    postDetail: {_id: ''}
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
        }
    }
})


export const {
    addPostDetail,
    removePostDetail
} = postReducer.actions


export default postReducer.reducer