import { loginUser, registerUser, addLoggedUser } from "../reducers/authReducer";
import axios from 'axios';

export const loginAction = (obj) => async (dispatch) => {
    try{
        let res = await axios.post('http://localhost:3001/auth/login', obj)
        res = res.data
        localStorage.setItem('token', res.token)
        return dispatch(loginUser({username: res.username, _id:res._id}))
    }catch(err){
        console.log(err)
    }
}