import React from 'react';
import '../style/Chats.css'
import {useDispatch, useSelector} from "react-redux";
import {setCurrentChat} from "../state/slices/chats.slice";

const Chats = () => {
    const dispatch = useDispatch()

    const chats = useSelector(state => state.chats.all)
    const users = useSelector(state => state.users)
    const id = localStorage.getItem('UID')

    return (
        <div className="chats">
            {
                chats.length > 0 ? chats.map((chat) => (
                    <div
                        className="chat-menu"
                        onClick={() => {
                            dispatch(setCurrentChat(chat.id))
                        }}
                    >
                        {
                            chat.users.map(user => (
                                user.id !== parseInt(id) && (
                                    <div
                                        key={user.id}
                                        className="chat-user"
                                    >
                                        <p className="chat-user__name">
                                            {user.name}
                                        </p>
                                        <p className="chat-user__message">
                                            {
                                                chat.messages && chat.messages.length && users.length && chat.messages[chat.messages.length - 1] ? (
                                                    <p className="chat-user__message">
                                                        {users.find(user => user.id === chat.messages[chat.messages.length - 1].from).name + ': ' + chat.messages[chat.messages.length - 1].message}
                                                    </p>
                                                ) : null
                                            }

                                        </p>
                                    </div>
                                )
                            ))
                        }
                    </div>
                ))
                    :
                    <div className="chat-empty">
                        <h2 className="chat-menu__info">
                            Here's no chats
                        </h2>
                    </div>
            }
        </div>
    );
};

export default Chats;