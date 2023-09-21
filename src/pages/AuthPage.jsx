import React, {useEffect, useState} from 'react';
import '../style/AuthPage.css'
import Sign from "../components/Sign";
import Login from "../components/Login";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAllUsersQuery, useGetUserMutation} from "../state/services/user";
import logo from "../images/Subtract.svg";

const AuthPage = () => {
    const navigate = useNavigate()

    const {method} = useParams()

    const [getMe] = useGetUserMutation()
    const {data: users, isLoading} = useGetAllUsersQuery()

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

    if(isLoading){
        return <div className="loading">
            <img src={logo} alt="logo" className="loader-logotype"/>
            <div className="loader">
                <div className="loader-inner"></div>
            </div>
        </div>
    }
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