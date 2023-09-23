import React, {useEffect, useRef, useState} from 'react';
import '../style/Chat.css'
import {useDispatch, useSelector} from "react-redux";
import {useSeeMessageMutation, useSendMessageMutation} from "../state/services/chat";
import {setCurrentChat, setReplying} from "../state/slices/chats.slice";

import seen from '../images/seen.png'
import tick from '../images/tick.png'

const Chat = () => {
    const dispatch = useDispatch()

    const chatRef = useRef(null)
    const inputRef = useRef(null)

    const chatWith = useSelector(state => state.chats.current)
    const chats = useSelector(state => state.chats.all)
    const users = useSelector(state => state.users)
    const replying = useSelector(state => state.chats.replying)

    const chat = chats.find(chat => chat.id === chatWith)

    const [sendMessage] = useSendMessageMutation()
    const [seeMessage] = useSeeMessageMutation()

    const [message, setMessage] = useState('')

    const [visibleMessages, setVisibleMessages] = useState([])

    const uid = parseInt(localStorage.getItem('UID'))

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            const token = localStorage.getItem('token');
            setMessage('');
            dispatch(setReplying(-1))

            const res = await sendMessage({
                from: uid,
                message: message,
                chat: chatWith,
                replied: replying !== -1 ? replying : null,
                token
            });
            if (res.data) {
            } else {
                console.log(res.error);
            }
        } else {
            setMessage('');
        }
    }

    const isMessageVisible = (messageElement, chatContainer) => {
        const messageRect = messageElement.getBoundingClientRect();
        const containerRect = chatContainer.getBoundingClientRect();

        return (
            messageRect.top >= containerRect.top &&
            messageRect.bottom <= containerRect.bottom
        );
    }

    const handleSeeMessage = async (messageId) => {
        const token = localStorage.getItem('token');

        const res = await seeMessage({messageId, token})

        if(res.data){
            console.log(res.data)
        } else {
            console.log(res.error)
        }
    }

    useEffect(() => {
        const messageElements = document.querySelectorAll('.message-box');

        messageElements.forEach((messageElement, index) => {
            const message = chat.messages[index];
            if (
                isMessageVisible(messageElement, chatRef.current) &&
                message.from !== uid &&
                message.seen === false &&
                !visibleMessages.includes(message.id)
            ) {
                handleSeeMessage(message.id);
                setVisibleMessages([...visibleMessages, message.id]);
            }
        });

        const scrollHandler = () => {
            messageElements.forEach((messageElement, index) => {
                const message = chat.messages[index];
                if (
                    isMessageVisible(messageElement, chatRef.current) &&
                    message.from !== uid &&
                    message.seen === false &&
                    !visibleMessages.includes(message.id)
                ) {
                    handleSeeMessage(message.id);
                    setVisibleMessages([...visibleMessages, message.id]);
                }
            });
        };

        if (chatRef.current) {
            chatRef.current.addEventListener('scroll', scrollHandler);
        }

        return () => {
            if (chatRef.current) {
                chatRef.current.removeEventListener('scroll', scrollHandler);
            }
        };
    }, [chat, visibleMessages]);


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
                            : null
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
                                            <>
                                                    {
                                                        message.replied !== null ?
                                                            <p className={`${message.from === uid ? 'message-reply__me' : ''} message-reply`}>
                                                                {message.replied.message}
                                                            </p>
                                                            : null
                                                    }
                                                    <div
                                                        key={index}
                                                        className={`message-box ${message.from === uid ? 'message-box__me' : ''}`}
                                                    >
                                                            <p className={`message-text ${message.from === uid ? 'message-text__me' : ''}`}>{message.message}</p>

                                                            <button
                                                                className="reply-message"
                                                                onClick={() => {
                                                                    dispatch(setReplying(message.id))
                                                                }}
                                                            >

                                                            </button>
                                                            <img
                                                                src={`${message.seen ? seen : tick}`}
                                                                alt=""
                                                                className="message-seen"
                                                            />
                                                    </div>
                                            </>
                                        ))
                                        : null
                                }
                            </div>
                            <div className="chat-footer">
                                {
                                    replying !== -1 ?
                                        <div className="reply-box">
                                            <div className="reply-box__inner">
                                                <p className="reply-text">
                                                    {
                                                        chat.messages.find(message => message.id === replying).message
                                                    }
                                                </p>
                                                <button
                                                    className="reply-remove"
                                                    onClick={() => {
                                                        dispatch(setReplying(-1))
                                                    }}
                                                >
                                                </button>
                                            </div>
                                        </div>
                                        : null
                                }
                                <div className="chat-footer__input-outer">
                        <textarea
                            placeholder="Input your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="chat-footer__input-inner"
                            ref={inputRef}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && event.ctrlKey) {
                                    handleSendMessage();
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