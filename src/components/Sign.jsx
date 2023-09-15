import React, {useState} from 'react';
import {useSignUserMutation} from "../state/services/user";
import {useNavigate} from "react-router-dom";

const Sign = () => {
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [isWrong, setIsWrong] = useState('')

    const [sign] = useSignUserMutation()

    const checkSum = () => {
        if(name !== '' && password !== ''){
            if(password === rePassword){
                setIsWrong('')
                return false
            } else {
                setIsWrong('Passwords not match!')
                return true
            }
        } else {
            setIsWrong('Not all inputs filled!')
            return true
        }
    }

    const handleSign = async (login, name, password) => {
        const check = checkSum()
        if(check) {
            return
        }
        const res = await sign({
            login,
            name,
            password
        })

        if(res.data) {
            localStorage.setItem('token', res.data.token)
            navigate('/')
        } else if (res.error) {
            console.log(res.error)
            setIsWrong('Account with this login already exit or something went wrong!')
            if(res.error.data.message){
                setIsWrong(res.error.data.message)
            }
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-heading">
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Name</p>
                    <input type="text" className="auth-input" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Login</p>
                    <input type="email" className="auth-input" value={login} onChange={(e) => setLogin(e.target.value)}/>
                </div>
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Password</p>
                    <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="auth-input__wrapper">
                    <p className="auth-input__info">Re-type your password</p>
                    <input type="password" className="auth-input" value={rePassword} onChange={(e) => setRePassword(e.target.value)}/>
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
                        await handleSign(login, name, password)
                    }}
                >
                    Sign
                </button>
                <p
                    className="auth-link"
                    onClick={() => {
                        navigate('/auth/login')
                    }}
                >
                    Already have an account?
                </p>
            </div>
        </div>
    );
};

export default Sign;