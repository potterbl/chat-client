import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userApi} from "./services/user";
import {chatApi} from "./services/chat";
import {chatsSlice} from "./slices/chats.slice";
import {usersSlice} from "./slices/users.slice";

const reducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    chats: chatsSlice.reducer,
    users: usersSlice.reducer
})

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(chatApi.middleware)
})