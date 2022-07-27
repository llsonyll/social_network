import { addPostDetail
} from "../reducers/postReducer.slice";
import axios from 'axios';

// const userId = '62dedd26ff1f6d86c08ca214'
export const premiumSubscription = (userId, info) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/premium/${userId}`, info, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return console.log(response.data);
    } catch (error) {
        console.log(error.response.data);
    }
};
