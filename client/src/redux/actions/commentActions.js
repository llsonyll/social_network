import { AllReviewes
} from "../reducers/postReducer";
import axios from 'axios';


export const createComment = (userId, postId, info) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3001/review/${userId}/${postId}`, info, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return dispatch(AllReviewes(response.data));
    } catch (error) {
        console.log(error)
    }
};
