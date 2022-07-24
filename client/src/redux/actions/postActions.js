import axios from 'axios';
import { addPostDetail } from '../reducers/postReducer.slice';
import { addNewPost, addNewPostProfile } from '../reducers/userReducer.slice';


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

export const createPost = (content, userId, path) => async (dispatch) => {
    try{
        let res = await axios.post('http://localhost:3001/post/' + userId, {content: content},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(path)
        if(path === '/home'){
            return dispatch(addNewPost(res.data))
        }else if(path === `/home/profile/${userId}`){
            return dispatch(addNewPostProfile(res.data))
        }
        else return
    }catch(err){
        console.log(err)
    }
}