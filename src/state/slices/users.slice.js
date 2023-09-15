import {createSlice} from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: 'usersSlice',
    initialState: [],
    reducers: {
        setUsers (state, action) {
            return action.payload
        },
        getUsers (state, action) {
            return state
        }
    }
})

export const {setUsers, getUsers} = usersSlice.actions
