import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    allChats: [],
    chatDetails: {}
}

const chatReducer = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setChats(state, action){
            state.allChats = action.payload
        },
        setChatInfo(state, action){
            state.chatDetails = action.payload
        },
        clearChats(state, action){
            state.allChats = []
        },
        clearChatInfo(state, action){
            state.chatDetails = {}
        }
    }
})

export const {
    setChats,
    setChatInfo,
    clearChats,
    clearChatInfo
} = chatReducer.actions

export default chatReducer.reducer
