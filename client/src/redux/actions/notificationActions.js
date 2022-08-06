import { socket } from "../../App";
import { apiConnection } from "../../utils/axios";
import { setNotifications, deleteNotificationR } from "../reducers/notificationReducer.slice";

export const getNotifications = (userId) => async (dispatch) => {
    try{
        let {data} = await apiConnection.get(`notification/${userId}`)
        //console.log(data, 'pidiendo las putas notificaciones')
        return dispatch(setNotifications(data))
    }catch(err){
        console.log(err)
    }
}

export const setSeenNotifications = (userId) => async(dispatch) => {
    try{
        let {data} = await apiConnection.put(`notification/seen/${userId}`)

        return dispatch(setNotifications(data))
    }catch(err){
        console.log(err)
    }
}

export const postNotification = ({type, refId, fromId, toId, username, profilePicture }) => async(dispatch) => {
    try{
        let content;
        if(type === 'postLike'){
            type = 'like'
            content = `@${username} liked your post!`
        }else if (type === 'commentLike'){
            type = 'like'
            content = `@${username} liked your comment!`
        }else if(type === 'comment'){
            content = `@${username} commented your post, lets check it out!`
        }else if(type === 'follow'){
            content = `@${username} has followed you, lets check his profile!`
        }else if(type === 'message'){
            content = `@${username} has send you a message!`
        }
        let body = {
            content,
            type,
            refId
        }
        await apiConnection.post(`notification/${fromId}/${toId}`, body)
        socket.emit('notification', type, refId, fromId, toId, username, profilePicture, content)
        return
    }catch(err){
        console.log(err)
    }
}


export const deleteNotification = (userId, notificationId) => async (dispatch) => {
    try{
        let {data} = await apiConnection.delete(`notification/${userId}/${notificationId}`)
        // console.log(data.msg)
        if(data.msg) return dispatch (deleteNotificationR(notificationId))
        
    } catch(err) {
        console.log(err)
    }
}