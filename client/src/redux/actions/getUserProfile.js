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
		 