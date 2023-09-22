import React, {useEffect, useRef, useState} from 'react';
import '../style/Chat.css'
import {useDispatch, useSelector} from "react-redux";
import {useSendMessageMutation} from "../state/services/chat";
import {setCurrentChat} from "../state/slices/chats.slice";

const Chat = () => {
    const dispatch = useDispatch()

    const chatRef = useRef(null)
    const inputRef = useRef(null)

    const chatWith = useSelector(state => state.chats.current)
    const chats = useSelector(state => state.chats.all)
    const users = useSelector(state => state.users)

    const chat = chats.find(chat => chat.id === chatWith)

    const [sendMessage] = useSendMessageMutation()

    const [message, setMessage] = useState('')

    const uid = parseInt(localStorage.getItem('UID'))

    const handleSendMessage = async () => {
        if(message !== ''){
            const token = localStorage.getItem('token')
            setMessage('')

            const res = await sendMessage({from: uid, message: message, chat: chatWith, token})
            if(res.data){
            } else {
                console.log(res.error)
            }
        }
    }

    const autoResize = () => {
        if(inputRef.current){
            const input = inputRef.current;
            input.style.height = '18px';
            input.style.height = Math.min(input.scrollHeight, 52) + 'px';
        }
    }

    useEffect(() => {
        autoResize()
    }, [message])

    useEffect(() => {
        if (chat && chat.messages && chat.messages.length > 0) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);


    return (
        <>
            <div className="chat">
                <div className="chat-header">
                    {
                        chat ?
                            <button
                                onClick={() => {
                                    dispatch(setCurrentChat(-1))
                                }}
                                className="chat-header__back-button"
                            >

                            </button>
                            :null
                    }
                    <p className="chat-header__username">
                        {
                            users.length ?
                                users.map(user => {
                                    return user.id === uid ? user.name : null
                                })
                                : null
                        }
                    </p>
                </div>
                {
                    chat ?
                        <>
                            <div className="chat-body" ref={chatRef}>
                                {
                                    chat.messages ?
                                    chat.messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message-box ${message.from === uid ? 'message-box__me' : null}`}
                                        >
                                            <p className={`message-text ${message.from === uid ? 'message-text__me' : null}`}>{message.message}</p>
                                        </div>
                                    ))
                                        :null
                                }
                            </div>
                            <div className="chat-footer">
                                <div className="chat-footer__input-outer">
                        <textarea
                            placeholder="Input your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="chat-footer__input-inner"
                            ref={inputRef}
                            onKeyDown={(key) => {
                                if (key.code === "Enter") {
                                    handleSendMessage()
                                }
                            }}
                        />
                                    <button
                                        className="chat-footer__input-button"
                                        onClick={() => handleSendMessage()}
                                    >

                                    </button>
                                </div>
                            </div>
                        </>
                        : null
                }
            </div>
        </>
    );
};

export default Chat;