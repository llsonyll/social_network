import { configureStore } from '@reduxjs/toolkit'
import authReducerSlice from './reducers/authReducer.slice'
import postReducerSlice from './reducers/postReducer.slice';
import reviewReducer from './reducers/reviewReducer';

const store = configureStore({
	reducer: {
		auth: authReducerSlice,
		review: reviewReducer,
		post: postReducerSlice
	},
})

export default store;
