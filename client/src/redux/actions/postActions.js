import axios from 'axios';
import { addPostDetail, likesPost, dislikesPost } from '../reducers/postReducer.slice';


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

export const createPost = (content, userId) => async (dispatch) => {
    try{
        let res = await axios.post('http://localhost:3001/post/' + userId, {content: content},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return
    }catch(err){
        console.log(err)
    }
}

export const newlikePostTitle = (postId,userId) => async (dispatch) => {
    try {
        let res = await axios.put(`http://localhost:3001/post/like/${postId}/${userId}`,{},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        dispatch(likesPost(res.data.likes));
    } catch (err) {
        console.log(err);
    }
}

export const newDislikesPostTitle = (postId,userId) => async (dispatch) => {
    try {
        let res = await axios.put(`http://localhost:3001/post/likes/${postId}/${userId}`,{},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        dispatch(likesPost(res.data.dislikes));
    } catch (err) {
        console.log(err)
    }
}
