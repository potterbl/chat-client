import React, {useEffect} from 'react';
import '../style/MainPage.css'
import {useNavigate} from "react-router-dom";
import {useGetAllUsersQuery, useGetUserMutation} from "../state/services/user";
import {useGetAllChatsMutation} from "../state/services/chat";
import {io} from "socket.io-client";
import Chats from "../components/Chats";
import CreateChat from "../components/CreateChat";
import {useDispatch} from "react-redux";
import {setUsers} from "../state/slices/users.slice";
import {setChats} from "../state/slices/chats.slice";
import Chat from "../components/Chat";

const MainPage = () => {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [getMe] = useGetUserMutation()
    const [getChats] = useGetAllChatsMutation()
    const {data: users} = useGetAllUsersQuery()
    dispatch(setUsers(users))

    const checkMe = async () => {
        const token = localStorage.getItem('token')
        if(token){
            const res = await getMe({token})

            if(res.error) {
                navigate('/auth/sign')
                localStorage.removeItem('token')
            } else if (res.data) {
                localStorage.setItem('UID', res.data.id)
            }
        } else {
            navigate('/auth/sign')
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000')
        const uid = localStorage.getItem('UID')

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on(`user_${uid}`, (data) => {
            console.log(data)
            if(data){
                const token = localStorage.getItem('token')
                getChatsHandler(token)
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const getChatsHandler = async (token) => {
        const res = await getChats({token})

        if(res.data){
            dispatch(setChats(res.data))
        } else {
            console.log(res.error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        getChatsHandler(token)
    }, [])

    useEffect(() => {
        checkMe()
    }, [])
    return (
        <div className="main-page">
            <div className="main-page__left">
                <CreateChat/>
                <Chats/>
            </div>
            <div className="main-page__right">
                <Chat/>
            </div>
            <button className="leave-account"
                onClick={() => {
                    localStorage.removeItem('token')
                    window.location.reload()
                }}
            >
            </button>
        </div>
    );
};

export default MainPage;