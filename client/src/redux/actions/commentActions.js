import { addPostDetail
} from "../reducers/postReducer.slice";
import axios from 'axios';


export const createComment = (userId, postId, info) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/comment/${userId}/${postId}`, info, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return dispatch(addPostDetail(response.data));
    } catch (error) {
        console.log(error)
    }
};
