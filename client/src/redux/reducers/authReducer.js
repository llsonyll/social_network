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
		loginUser(state, action){
			state.loggedUser = action.payload
		},
		registerUser(state, action){
			state.loggedUser = action.payload
		},
		addLoggedUser(state, action){
			state.loggedUser = action.payload
		},
		logOutUser(state, action){
			localStorage.removeItem('token')
			state.loggedUser = {}
		},
		removeLoggedUser(state, action){
			state.loggedUser = {}
		}
	},
})

export const {
	/* AddAsyncNumber */
	loginUser,
	registerUser,
	addLoggedUser,
	logOutUser,
	removeLoggedUser
} = authReducer.actions

export default authReducer.reducer
