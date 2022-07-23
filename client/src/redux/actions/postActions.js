import axios from 'axios';
import { addPostDetail } from '../reducers/postReducer.slice';


export const getPost = (postId) => async (dispatch) => {
    try{
        let res = await axios.get('http://localhost:3001/post/' + postId,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        res = res.data
        return dispatch(addPostDetail(res))
    }catch(err){
        console.log(err)
    }
}