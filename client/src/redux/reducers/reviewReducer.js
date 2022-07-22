import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    allReviewes: []
}

const reviewReducer = createSlice({
	name: 'review',
	initialState,
	reducers: {
        AllReviewes(state, action) {
            state.allReviewes = action.payload;
        },
        NewReview(state, action) {
            state.allReviewes = [...state.allReviewes, action.payload]
        }
	},
})

export const {
    AllReviewes,
    NewReview
} = reviewReducer.actions

export default reviewReducer.reducer
