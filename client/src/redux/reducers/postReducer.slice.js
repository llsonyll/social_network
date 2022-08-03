import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    postDetail: {},
    loadingPostDetail: true,
}

const postReducer = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPostDetail(state, action) {
            state.postDetail = action.payload
        },
        removePostDetail(state, action) {
            state.postDetail = {}
        },
        likesPost({postDetail}, {payload}) {
            if(postDetail.dislikes.includes(payload.userId)){ 
                postDetail.dislikes = postDetail.dislikes.filter(_id => _id !== payload.userId);
            }
            if(postDetail.likes.includes(payload.userId)){
                postDetail.likes = postDetail.likes.filter(_id => _id !== payload.userId);
            }else{
                postDetail.likes.push(payload.userId);
            }
        },
        dislikesPost({postDetail}, {payload}) {
            if(postDetail.likes.includes(payload.userId)){ 
                postDetail.likes = postDetail.likes.filter(_id => _id !== payload.userId);
            }
            if(postDetail.dislikes.includes(payload.userId)){
                postDetail.dislikes = postDetail.dislikes.filter(_id => _id !== payload.userId);
            }else{
                postDetail.dislikes.push(payload.userId);
            }
        },
        likesComment(state, { payload }) {
            let index = state.postDetail.commentsId.findIndex(comment => comment._id === payload._id);
            state.postDetail.commentsId[index].dislikes = payload.dislikes;
            state.postDetail.commentsId[index].likes = payload.likes;
        },
        dislikesComment(state, { payload }) {
            let index = state.postDetail.commentsId.findIndex(comment => comment._id === payload._id);
            state.postDetail.commentsId[index].dislikes = payload.dislikes;
            state.postDetail.commentsId[index].likes = payload.likes;
        },
        dislikesComment(state, { payload }) {
            let index = state.postDetail.commentsId.findIndex(comment => comment._id === payload._id);
            state.postDetail.commentsId[index].dislikes = payload.dislikes;
            state.postDetail.commentsId[index].likes = payload.likes;
        },
        setLoadingPostDetail(state, { payload }) {
            state.loadingPostDetail = payload;
        }
    }
})


export const {
    addPostDetail,
    removePostDetail,
    likesPost,
    dislikesPost,
    likesComment,
    dislikesComment,
    setLoadingPostDetail
} = postReducer.actions


export default postReducer.reducer
