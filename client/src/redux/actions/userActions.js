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
		//console.log(res.data)
			return dispatch(homePosts(res.data));
		} catch (err) {
		  console.log(err);
		}
	 };

	 export const newLikeHomePost = (postId,userId,page) => async(dispatch) =>{
		try {
			let res = await axios.put(`http://localhost:3001/post/like/${postId}/${userId}`,{},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			dispatch(getHomePosts(userId,page));
		} catch (err) {
		  	console.log(err);
		}
	 };
		 
	 export const newDislikeHomePost = (postId,userId,page) => async(dispatch) =>{
		try {
			let res = await axios.put(`http://localhost:3001/post/like/${postId}/${userId}`,{},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			dispatch(getHomePosts(userId,page));
		} catch (err) {
		  	console.log(err);
		}
	 };

	 export const newLikeUserProfile = (postId,userId) => async(dispatch) =>{
		try {
			let res = await axios.put(`http://localhost:3001/post/like/${postId}/${userId}`,{},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			dispatch(userProfile(res.data.userPost));
		} catch (err) {
		  	console.log(err);
		}
	 };
		 
	 export const newDislikeUserProfile = (postId,userId) => async(dispatch) =>{
		try {
			let res = await axios.put(`http://localhost:3001/post/like/${postId}/${userId}`,{},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			dispatch(userProfile(res.data.userPost));
		} catch (err) {
		  	console.log(err);
		}
	 };
	 export const modifyUser =(id, obj) => async(dispatch) => {
		//recibe Id por params, y el obj va a ser la propiedad a modificar
		try{
			let res = await axios.put(`http://localhost:3001/user/${id}`, obj, {headers:{
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}})
			return dispatch(userProfile(res.data))
		}catch(err){
			console.log(err)
		}
	 } 
		 
