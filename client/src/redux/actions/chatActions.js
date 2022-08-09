import axios from "axios"
import { socket } from "../../App"
import { apiConnection } from "../../utils/axios"
import { addMessage, setChatInfo, setChats, setUnseenMessages } from "../reducers/chatReducer"



export const getChats = (userId) => async(dispatch) => {
    try{
        let {data} = await apiConnection.get(`chat/${userId}`)

        return dispatch(setChats(data.chats))

    }catch(err){
        console.log(err)
    }
}

export const getChatInfo = (userId, otherUserId) => async(dispatch) =>{
    try{
        let {data} = await apiConnection.get(`chat/${userId}/${otherUserId}`)
        return dispatch(setChatInfo(data))
    }catch(err){
        console.log(err)
    }
}

export const sendMessage = (content, userId, chatId, socketId) => async(dispatch) => {
    try{
        let {data} = await apiConnection.post(`chat/message/${userId}/${chatId}`, {content: content})
        if(socketId){
            socket.emit('privMessage', content, socketId, userId, chatId)
        }

        return dispatch(addMessage(data))
    }catch(err){
        console.log(err)
    }
}

export const getUnseenMessagesAmount = (userId) => async(dispatch) => {
    try{
        let {data} = await apiConnection.get(`chat/unseen/${userId}`)

        return dispatch(setUnseenMessages(data.unseenMessages))
    }catch(err){
        console.log(err)
    }
}

export const setSeenMessages = (userId, chatId) => async(dispatch) => {
    try{
        let {data} = await apiConnection.put(`chat/${userId}/${chatId}`)

        return dispatch(getUnseenMessagesAmount(userId))
    }catch(err){
        console.log(err)
    }
}
