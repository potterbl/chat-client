import React, {useEffect, useRef, useState} from 'react';
import '../style/Chat.css'
import {useDispatch, useSelector} from "react-redux";
import {setCurrentChat} from "../state/slices/chats.slice";
import {useSendMessageMutation} from "../state/services/chat";

const Chat = () => {
    const dispatch = useDispatch()

    const chatRef = useRef(null)

    const chatWith = useSelector(state => state.chats.current)
    const chats = useSelector(state => state.chats.all)

    const chat = chats.find(chat => chat.id === chatWith)

    const [sendMessage] = useSendMessageMutation()

    const [message, setMessage] = useState('')

    const uid = parseInt(localStorage.getItem('UID'))

    const handleSendMessage = async () => {
        if(message !== ''){
            const token = localStorage.getItem('token')

            const res = await sendMessage({from: uid, message: message, chat: chatWith, token})
            if(res.data){
                setMessage('')
            } else {
                console.log(res.error)
            }
        }
    }

    useEffect(() => {
        if (chat && chat.messages && chat.messages.length > 0) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);


    return (
        <>
        {
            chat ?
                <div className="chat">
                    <div className="chat-header">
                        <button
                            className="chat-header__button"
                            onClick={() => {
                                dispatch(setCurrentChat(-1))
                            }}
                        >
                            <svg
                                width="100%"
                                height="100%"
                            >
                                <line
                                    x1="50%" y1="0"
                                    x2="0" y2="50%"
                                    strokeWidth={2}
                                    stroke="white"
                                />
                                <line
                                    x1="0" y1="50%"
                                    x2="50%" y2="100%"
                                    strokeWidth={2}
                                    stroke="white"
                                />
                                <line
                                    x1="0" y1="50%"
                                    x2="100%" y2="50%"
                                    strokeWidth={2}
                                    stroke="white"
                                />
                            </svg>
                        </button>
                        <p>
                            {chat.users
                                .filter(user => user.id !== parseInt(localStorage.getItem('UID')))
                                .map(user => user.name)
                                .join(', ')}
                        </p>
                    </div>
                    <div className="chat-body" ref={chatRef}>
                        {
                            chat.messages && chat.messages.map(message => (
                                <div
                                    className='message'
                                    style={{alignSelf: message.from !== uid ? 'flex-start' : 'flex-end'}}
                                >
                                    {message.message}
                                </div>
                            ))
                        }
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            className="chat-footer__input"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                            }}
                            onKeyDown={(key) => {
                                if(key.code === "Enter") {
                                    handleSendMessage()
                                }
                            }}
                        />
                        <button
                            className="chat-footer__button"
                            onClick={() => handleSendMessage()}
                        >

                        </button>
                    </div>
                </div>
                : null
        }
        </>
    );
};

export default Chat;