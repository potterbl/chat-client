import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `http://localhost:5000/chat`
    }),
    endpoints: (builder) => ({
        getAllChats: builder.mutation({
            query: ({token}) => ({
                url: '/user',
                method: 'POST',
                body: {token}
            })
        }),
        createChat: builder.mutation({
            query: ({usersId, token}) => ({
                url: '/create',
                method: 'POST',
                body: {usersId, token}
            })
        }),
        sendMessage: builder.mutation({
            query: ({from, chat, message, token}) => ({
                url: '/sendMessage',
                method: 'POST',
                body: {from, chat, message, token}
            })
        })
    })
})

export const { useGetAllChatsMutation, useCreateChatMutation, useSendMessageMutation } = chatApi