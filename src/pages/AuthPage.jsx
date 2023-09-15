import React, {useEffect} from 'react';
import '../style/AuthPage.css'
import Sign from "../components/Sign";
import Login from "../components/Login";
import {useNavigate, useParams} from "react-router-dom";
import {useGetUserMutation} from "../state/services/user";

const AuthPage = () => {
    const navigate = useNavigate()

    const {method} = useParams()

    const [getMe] = useGetUserMutation()

    const checkMe = async () => {
        const token = localStorage.getItem('token')
        if(token){
            const res = await getMe({token})

            if(res.error) {
                localStorage.removeItem('token')
            } else if(res.data){
                navigate('/')
            }
        }
    }

    useEffect(() => {
        checkMe()
    }, [checkMe])
    return (
        <div className="auth">
            {
                method === 'sign' ?
                    <Sign/>
                    : method === 'login' ?
                        <Login/>
                        : null
            }
        </div>
    );
};

export default AuthPage;