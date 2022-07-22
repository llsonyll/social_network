import { loginUser } from "../reducers/authReducer.slice";
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

export const registerAction = (obj) => async (dispatch) =>{
    try{
        let res = await axios.post('http://localhost:3001/auth/register', obj)
        res = res.data
        localStorage.setItem('token', res.token)
        return dispatch(loginUser({username: res.username, _id: res._id}))
    }catch(err){
        console.log(err)
    }
}

export const getLoggedUserInfo = () => async (dispatch) => {
    try{
        let res = await axios.post('http://localhost:3001/auth',{}, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        res = res.data
        return dispatch(loginUser({username: res.username, _id: res._id}))
    }catch(err){
        console.log(err)
    }
}
