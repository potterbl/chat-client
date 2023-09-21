import React, {useEffect, useState} from 'react';
import '../style/CreateChat.css'
import {useCreateChatMutation} from "../state/services/chat";
import {useDispatch, useSelector} from "react-redux";
import {updateChats} from "../state/slices/chats.slice";

const CreateChat = () => {
    const dispatch = useDispatch()

    const [isDialog, setIsDialog] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [filter, setFilter] = useState('')
    const [result, setResult] = useState([])

    const chats = useSelector(state => state.chats.all)
    const users = useSelector(state => state.users)

    useEffect(() => {
        const myId = localStorage.getItem('UID');

        if (users && chats) {
            let updatedChatUserIds = [];

            if (chats.length) {
                updatedChatUserIds = chats
                    .map(chat => chat.users.map(user => user.id))
                    .flat();
            }

            const updatedFilteredUsers = users.filter(user =>
                !updatedChatUserIds.includes(user.id) && user.id !== parseInt(myId)
            );

            setFilteredUsers(updatedFilteredUsers);
        }
    }, [chats, users]);


    useEffect(() => {
        if(filter !== ''){
            setResult(filteredUsers.filter(user => user.name.toLowerCase().match(filter.toLowerCase())))
        } else {
            setResult(filteredUsers)
        }
    }, [filter, filteredUsers])

    const [createChat] = useCreateChatMutation()

    const handleCreateChat = async (to) => {
        const uid = parseInt(localStorage.getItem('UID'))
        const token = localStorage.getItem('token')

        const usersId = [to, uid]

        const res = await createChat({usersId, token})

        if(res.data){
            dispatch(updateChats(res.data))
            setIsDialog(false)
        } else {
            console.log(res.error)
        }
    }

    return (
        <>
            {
                isDialog &&
                <div
                    className="chat-create__dialog"
                    onClick={(e) => {
                        setIsDialog(false)
                    }}
                >
                    <div
                        className="chat-create__dialog-content"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <div className="chat-create__dialog-content__header">
                            <button
                                className="chat-create__dialog-content__header-button"
                                onClick={() => {
                                    setIsDialog(false)
                                }}
                            >
                                <svg width="100%" height="100%">
                                    <line
                                        x1="0" y1="0"
                                        x2="100%" y2="100%"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="capp"
                                    />
                                    <line
                                        x1="100%" y1="0"
                                        x2="0" y2="100%"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="capp"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="chat-create__dialog-content__body">
                            <input
                                type="text"
                                placeholder="Input username"
                                className="chat-create__dialog-content__body-input"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <div className="chat-create__dialog-content__body-results">
                                {
                                    result &&
                                    result.map(user => (
                                        <button
                                            key={user.id}
                                            className="create-chat__dialog-content__body-result"
                                            onClick={() => {
                                                handleCreateChat(user.id)
                                            }}
                                        >
                                            {user.name}

                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="create-chat">
                <button
                    className="chat-create__button"
                    onClick={() => {
                        setIsDialog(true)
                    }}
                >
                    New chat
                </button>
            </div>
        </>
    );
};

export default CreateChat;