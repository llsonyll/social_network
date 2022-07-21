import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loggedUser: {},
}

const authReducer = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		/* AddAsyncNumber(state, action) {
			console.log(action.payload)
			state.datos = action.payload
		},  */
	},
})

export const {
	/* AddAsyncNumber */
} = authReducer.actions

export default authReducer.reducer
