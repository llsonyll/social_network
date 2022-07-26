import { loginUser } from '../reducers/authReducer.slice'
import axios from 'axios'
import Swal from 'sweetalert2'

export const loginAction = (obj) => async (dispatch) => {
	try {
		let res = await axios.post('http://localhost:3001/auth/login', obj)
		res = res.data
		localStorage.setItem('token', res.token)
		return dispatch(loginUser({ username: res.username, _id: res._id , profilePicture: res.profilePicture}))
	} catch (err) {
		console.log(err)
		//alerta de error
		Swal.fire({
			icon: 'error',
			title: 'Ups... Something went wrong',
			text: err.response.data,
			background: '#4c4d4c',
			color: 'white',
		})
	}
}

export const registerAction = (obj) => async (dispatch) => {
	try {
		let res = await axios.post('http://localhost:3001/auth/register', obj)
		res = res.data
		localStorage.setItem('token', res.token)
		return dispatch(loginUser({ username: res.username, _id: res._id , profilePicture: res.profilePicture}))
	} catch (err) {
		console.log(err)
		//alerta de error
		Swal.fire({
			icon: 'error',
			title: 'Ups... Something went wrong',
			text: err.response.data.message,
			background: '#4c4d4c',
			color: 'white',
		})
	}
}

export const getLoggedUserInfo = () => async (dispatch) => {
	try {
		let res = await axios.post(
			'http://localhost:3001/auth',
			{},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
		res = res.data
		return dispatch(loginUser({ username: res.username, _id: res._id , profilePicture: res.profilePicture}))
	} catch (err) {
		console.log(err)
	}
}
