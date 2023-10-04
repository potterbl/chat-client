import {createSlice} from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: 'usersSlice',
    initialState: [],
    reducers: {
        setUsers (state, action) {
            return action.payload
        }
    }
})

export const {setUsers} = usersSlice.actions
