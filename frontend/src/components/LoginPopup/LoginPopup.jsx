import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { api } from '../../services/api'
import Modal from '../ui/Modal/Modal'

const LOGIN = 'Login'
const SIGN_UP = 'Sign Up'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken } = useContext(StoreContext)

    const [mode, setMode] = useState(LOGIN)
    const [data, setData] = useState({ name: '', email: '', password: '' })
    const close = () => setShowLogin(false)

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        const response = mode === LOGIN ? await api.login(data) : await api.register(data)

        if (response.success) {
            setToken(response.token)
            localStorage.setItem('token', response.token)
            close()
        } else {
            alert(response.message)
        }
    }

    return (
        <Modal onClose={close} label={mode} position='center'>
            <form onSubmit={onSubmit} className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{mode}</h2>
                    <button type='button' className='login-popup-close' aria-label='Close' onClick={close}>
                        <img src={assets.cross_icon} alt='' />
                    </button>
                </div>
                <div className='login-popup-inputs'>
                    {mode === SIGN_UP && <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your Name' autoComplete='name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your Email' autoComplete='email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' autoComplete={mode === LOGIN ? 'current-password' : 'new-password'} required />
                </div>
                <button type='submit'>{mode === SIGN_UP ? 'Create account' : 'Login'}</button>
                <label className='login-popup-condition'>
                    <input type='checkbox' required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </label>
                {mode === LOGIN
                    ? <p>Create a new account? <button type='button' className='login-popup-switch' onClick={() => setMode(SIGN_UP)}>Click Here</button></p>
                    : <p>Already have an account? <button type='button' className='login-popup-switch' onClick={() => setMode(LOGIN)}>Login here</button></p>
                }
            </form>
        </Modal>
    )
}

export default LoginPopup
