import { configureStore } from '@reduxjs/toolkit'
import authReducerSlice from './reducers/authReducer.slice'
import reviewReducer from './reducers/reviewReducer';

const store = configureStore({
	reducer: {
		auth: authReducerSlice,
		review: reviewReducer
	},
})

export default store;
