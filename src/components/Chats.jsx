import React from 'react';
import '../style/Chats.css'
import {useDispatch, useSelector} from "react-redux";
import {setCurrentChat, setReplying} from "../state/slices/chats.slice";

const Chats = () => {
    const dispatch = useDispatch()

    const chats = useSelector(state => state.chats.all)
    const currentChat = useSelector(state => state.chats.current)
    const users = useSelector(state => state.users)
    const id = localStorage.getItem('UID')

    return (
        <div className="chats">
            <div className="chats-menu">
                {
                    chats.length && users.length ?
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                className={`chats-menu__user ${currentChat === chat.id ? 'chats-menu__user-active' : null}`}
                                onClick={() => {
                                    dispatch(setCurrentChat(chat.id))
                                    dispatch(setReplying(-1))
                                }}
                            >
                                <div className="chat-menu__left">
                                    <p className="chat-menu__username">
                                        {
                                            chat.users.map(user => {
                                                return user.id !== parseInt(id) ? user.name : null
                                            })
                                        }
                                    </p>
                                    {
                                        chat.messages && chat.messages.length ?
                                            <p className="chat-menu__info">
                                                {chat.users.find(user => user.id === chat.messages[chat.messages.length - 1].from).name
                                                    +
                                                    ': '
                                                    +
                                                    chat.messages[chat.messages.length - 1].message}
                                            </p>
                                            : null
                                    }
                                </div>
                                {
                                    chat.messages && chat.messages.length && chat.messages.some(message => {
                                        return message.from !== parseInt(id) && !message.seen;
                                    }) ?
                                            <div className="chat-unread">
                                                <p className="chat-unread__count">
                                                    {
                                                        chat.messages.reduce((sum, message) => {
                                                            if (message.from !== parseInt(id) && !message.seen) {
                                                                return sum + 1
                                                            }
                                                            return sum !== 0 ? sum : null
                                                        }, 0)
                                                    }
                                                </p>
                                            </div>
                                        : null
                                }
                            </button>
                        ))
                        :
                        <div className="chats-empty">
                            <p>Here's no chats</p>
                        </div>
                }

            </div>
        </div>
    );
};

export default Chats;