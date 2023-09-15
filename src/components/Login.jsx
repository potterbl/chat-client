import React, { useState} from 'react';
import {useLoginUserMutation} from "../state/services/user";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [isWrong, setIsWrong] = useState('')

    const [loginMe] = useLoginUserMutation()

    const checkSum = () => {
        if(login !== '' && password !== ''){
            setIsWrong('')
            return false
        } else {
            setIsWrong('Not all inputs filled!')
            return true
        }
    }

    const handleSign = async (login, password) => {
        const check = checkSum()
        if(check) {
            return
        }
        const res = await loginMe({
            login,
            password
        })

        if(res.data) {
            localStorage.setItem('token', res.data.token)
            navigate('/')
        } else {
            console.log(res.error)
            setIsWrong('Account is not exit or something went wrong!')
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-heading">
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Login</p>
                    <input type="email" className="auth-input" value={login} onChange={(e) => setLogin(e.target.value)}/>
                </div>
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Password</p>
                    <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>

            {
                isWrong !== '' ?
                    <p className="auth-wrong">{isWrong}</p>
                    : null
            }

            <div className="auth-bottom">
                <button
                    className="auth-button"
                    onClick={async () => {
                        await handleSign(login, password)
                    }}
                >
                    login
                </button>
                <p
                    className="auth-link"
                    onClick={() => {
                        navigate('/auth/sign')
                    }}
                >
                    Dont have an account yet?
                </p>
            </div>
        </div>
    );
};

export default Login;