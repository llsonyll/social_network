import axios from "axios"
import { apiConnection } from "../../utils/axios"
import { addMessage, setChatInfo, setChats } from "../reducers/chatReducer"



export const getChats = (userId) => async(dispatch) => {
    try{
        let res = await apiConnection.get(`chat/${userId}`)

        return dispatch(setChats(res.data.chats))

    }catch(err){
        console.log(err)
    }
}

export const getChatInfo = (userId, otherUserId) => async(dispatch) =>{
    try{
        let res = await apiConnection.get(`chat/${userId}/${otherUserId}`)
        console.log(res.data)
        return dispatch(setChatInfo(res.data))
    }catch(err){
        console.log(err)
    }
}

export const sendMessage = (content, userId, chatId) => async(dispatch) => {
    try{
        let res = await apiConnection.post(`chat/message/${userId}/${chatId}`, {content: content})

        console.log(res.data)
        return dispatch(addMessage(res.data))
    }catch(err){

    }
}