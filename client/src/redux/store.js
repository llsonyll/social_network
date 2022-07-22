import { configureStore } from '@reduxjs/toolkit'
import authReducerSlice from './reducers/authReducer.slice'

const store = configureStore({
	reducer: {
		auth: authReducerSlice,
	},
})

export default store
