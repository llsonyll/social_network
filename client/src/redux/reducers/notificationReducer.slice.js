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
        }
    }
})


export const {
    addNotification,
    setNotifications
} = notificationsReducer.actions

export default notificationsReducer.reducer