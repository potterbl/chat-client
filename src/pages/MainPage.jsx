import React, {useEffect, useState} from 'react';
import '../style/MainPage.css'
import {useNavigate} from "react-router-dom";
import {useGetAllUsersQuery, useGetUserMutation} from "../state/services/user";
import {useGetAllChatsMutation} from "../state/services/chat";
import {io} from "socket.io-client";
import Chats from "../components/Chats";
import CreateChat from "../components/CreateChat";
import {useDispatch, useSelector} from "react-redux";
import {setUsers} from "../state/slices/users.slice";
import {setChats} from "../state/slices/chats.slice";
import Chat from "../components/Chat";
import LeaveAccountButton from "../components/LeaveAccountButton";
import logo from '../images/Subtract.svg'

const MainPage = () => {
    const token = localStorage.getItem('token')

    const currentChat = useSelector(state => state.chats.current)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [getChats] = useGetAllChatsMutation()
    const [getMe] = useGetUserMutation()

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io('https://chat-x8ru.onrender.com')
        const uid = localStorage.getItem('UID')

        newSocket.on('connect', async () => {
            console.log('connected')
            await getChatsHandler(token)
            setSocket(newSocket)
        })

        newSocket.on(`user_${uid}`, async (data) => {
            console.log(data)
            if(data){
                const token = localStorage.getItem('token')
                await getChatsHandler(token)
            }
        })

        return () => {
            newSocket.disconnect()
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

    const {data: users, error} = useGetAllUsersQuery()
    dispatch(setUsers(users))

    if(!error){
        if( users && !users.length){
            window.location.reload()
        }
    } else {
        localStorage.removeItem('token')
        window.location.reload()
    }


    const checkMe = async () => {
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
        checkMe()
    }, [])

    if(socket === null){
        return <div className="loading">
            <img src={logo} alt="logo" className="loader-logotype"/>
            <div className="loader">
                <div className="loader-inner"></div>
            </div>
        </div>
    }

    return (
        <div className="main-page">
            {
                window.innerWidth > 450 || currentChat === -1 ?
                    <div className="main-page__left">
                        <CreateChat/>
                        <Chats/>
                    </div>
                    : null
            }
            {
                window.innerWidth > 450 || currentChat !== -1 ?
                    <>
                        <div className="main-page__right">
                            <Chat/>
                        </div>
                        <LeaveAccountButton/>
                    </>
                    : null
            }

        </div>
    );
};

export default MainPage;