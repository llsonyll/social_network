import { getUsers } from '../reducers/authReducer.slice'

export const getUsersFetch = () => (dispatch) => {
	return fetch('https://pokeapi.co/api/v2/item/234/')
		.then((res) => res.json())
		.then((res) => dispatch(getUsers(res)))
		.catch((e) => console.log(e))
}
