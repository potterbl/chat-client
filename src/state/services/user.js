import {config} from 'dotenv'
config()

import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://chat-x8ru.onrender.com/auth`
    }),
    endpoints: (builder) => ({
        signUser: builder.mutation({
            query: ({name, login, password}) => ({
                url: '/sign',
                method: 'POST',
                body: {name, login, password}
            })
        }),
        loginUser: builder.mutation({
            query: ({login, password}) => ({
                url: '/login',
                method: 'POST',
                body: {login, password}
            })
        }),
        getUser: builder.mutation({
            query: ({token}) => ({
                url: '/',
                method: 'POST',
                body: {token}
            })
        }),
        getAllUsers: builder.query({
            query: () => ({

            })
        })
    })
})

export const { useSignUserMutation, useLoginUserMutation, useGetUserMutation, useGetAllUsersQuery } = userApi