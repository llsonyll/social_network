import { loginUser, registerUser, addLoggedUser } from "../reducers/authReducer.slice";
import axios from 'axios';

export const loginAction = (obj) => async (dispatch) => {
    try{
        console.log(obj)
        let res = await axios.post('http://localhost:3001/auth/login', obj)
        res = res.data
        console.log(res)
        localStorage.setItem('token', res.token)
        return dispatch(loginUser({username: res.username, _id:res._id}))
    }catch(err){
        console.log(err)
    }
}