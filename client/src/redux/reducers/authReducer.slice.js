import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loggedUser: 0,
}

const authReducerSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		getUsers(state, action) {
			console.log(action.payload)
			state.datos = action.payload
		},
	},
})

export const { getUsers } = authReducerSlice.actions

export default authReducerSlice.reducer
