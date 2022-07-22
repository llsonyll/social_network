import { AllReviewes,
    NewReview
} from "../reducers/reviewReducer";
import axios from 'axios';

export const getAllReviewes = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:3001/review');
        return dispatch(AllReviewes(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const createNewReview = (userId, info) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/review/${userId}`, info, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return dispatch(NewReview(response.data));
    } catch (error) {
        console.log(error)
    }
};

export const modifyReview = (userId, reviewId, info) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3001/review/${userId}/${reviewId}`, info, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return dispatch(AllReviewes(response.data));
    } catch (error) {
        console.log(error)
    }
};

export const deleteReview = (userId, reviewId) => async (dispatch) => {
    try {
        const response = await axios.delete(`http://localhost:3001/review/${userId}/${reviewId}`, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return dispatch(AllReviewes(response.data));
    } catch (error) {
        console.log(error)
    }
};
