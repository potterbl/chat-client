import {createSlice} from "@reduxjs/toolkit";

export const chatsSlice = createSlice({
    name: 'chats',
    initialState: {
        all: [],
        current: -1,
        replying: -1
    },
    reducers: {
        updateChats(state, action) {
            state.all = [ ...state.all, action.payload]
        },
        setChats(state, action){
            state.all = action.payload
        },
        getChats(state, action) {
            return state.all
        },
        setCurrentChat(state,action){
            state.current = action.payload
        },
        setReplying(state, action) {
            state.replying = action.payload
        }
    }
})

export const { updateChats, setChats, getChats, setCurrentChat, setReplying } = chatsSlice.actions