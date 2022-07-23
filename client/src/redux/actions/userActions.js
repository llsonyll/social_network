import { userProfile, homePosts } from '../reducers/userReducer.slice'
import axios from 'axios'


export const getUserProfile = (id) => async(dispatch) => {
		try {
		 let res = await axios.get(`http://localhost:3001/user/${id}`,{headers:{
			   Authorization: `Bearer ${localStorage.getItem('token')}`
		   }})
		//    console.log(res.data)
			return dispatch(userProfile(res.data));
		} catch (err) {
		  console.log(err);
		}
	 };

	 export const getHomePosts = (id, page) => async(dispatch) => {
//id del usuario por params y numero de pag por query. trae de a 20 posts 
		try {
		 let res = await axios.get(`http://localhost:3001/user/home/${id}?page=${page}`,{headers:{
			   Authorization: `Bearer ${localStorage.getItem('token')}`
		   }})
		//    console.log(res.data)
			return dispatch(homePosts(res.data));
		} catch (err) {
		  console.log(err);
		}
	 };
		 