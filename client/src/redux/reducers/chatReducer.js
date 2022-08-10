import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    allChats: [],
    chatDetails: {},
    unseenMessages: 0,
    searchedChats: []
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
        },
        addMessage(state,action){
            state.chatDetails.messages = [...state.chatDetails.messages, action.payload]
        },
        orderChats(state, action){
            let chat = state.allChats.find(chat => chat._id === action.payload)
            let oldChats = state.allChats.filter(chat => chat._id !== action.payload)
            state.allChats = [chat, ...oldChats]
        },
        setUnseenMessages(state, action){
            state.unseenMessages = action.payload
        },
        addUnseenMessage(state, action){
            state.unseenMessages++
        },
        addSearchedChats(state, action){
            state.searchedChats = action.payload
        },
        clearSearchedChats(state, action){
            state.searchedChats = []
        }
    }
})

export const {
    setChats,
    setChatInfo,
    clearChats,
    clearChatInfo,
    addMessage,
    orderChats,
    setUnseenMessages,
    addUnseenMessage,
    addSearchedChats,
    clearSearchedChats
} = chatReducer.actions

export default chatReducer.reducer
