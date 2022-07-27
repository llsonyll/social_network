import axios from "axios"
import { addMessage, setChatInfo, setChats } from "../reducers/chatReducer"



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

export const getChatInfo = (userId, otherUserId) => async(dispatch) =>{
    try{
        let res = await axios.get(`http://localhost:3001/chat/${userId}/${otherUserId}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(res.data)
        return dispatch(setChatInfo(res.data))
    }catch(err){
        console.log(err)
    }
}

export const sendMessage = (content, userId, chatId) => async(dispatch) => {
    try{
        let res = await axios.post(`http://localhost:3001/chat/message/${userId}/${chatId}`, content ,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        console.log(res.data)
        return dispatch(addMessage(res.data))
    }catch(err){

    }
}