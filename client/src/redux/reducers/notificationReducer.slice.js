import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    notifications: []
}

const notificationsReducer = createSlice({
    name: 'notification',
    initialState,
    reducers:{
        addNotification(state, action){
            state.notifications = [action.payload, ...state.notifications]
        },
        setNotifications(state, action){
            state.notifications = action.payload
        },
        deleteNotificationR(state, action) {
            console.log(action.payload)
            state.notifications = state.notifications.filter((n) => n._id !== action.payload)
        }
    }
})


export const {
    addNotification,
    setNotifications,
    deleteNotificationR
} = notificationsReducer.actions

export default notificationsReducer.reducer