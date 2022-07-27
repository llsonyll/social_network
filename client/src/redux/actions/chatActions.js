import axios from "axios"
import { setChats } from "../reducers/chatReducer"



export const getChats = (userId) => async(dispatch) => {
    try{
        let res = await axios.get(`http://localhost:3001/chat/${userId}`, {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(res.data)

        return dispatch(setChats(res.data.chats))

    }catch(err){
        console.log(err)
    }
}