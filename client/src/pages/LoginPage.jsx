import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { show_hide_password } from '../scripts/password.js';
import { showAlert } from '../utils/showSwalAlert.js';
import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import Swal from 'sweetalert2';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosAuthInstance.post('/login', { username, password }, { withCredentials: true });

            if (response.data.user.status !== "blocked") {
                Swal.fire({
                    title: "Logowanie",
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        navigate('/');
                    }
                });
            }
            else {
                Swal.fire({
                    title: "Logowanie",
                    text: "Dany użytkownik jest zablokowany",
                    icon: 'warning',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        navigate('/');
                    }
                });
            }
        }
        catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                showAlert(status, "Logowanie", message);
            }
            else {
                console.error('Error:', error.message);
                showAlert("500", "Logowanie", error.message);
            }
        }
    }

    return (
        <>
            <header>
                <nav className="flex bg-[#1e1e1e] p-3.5 text-white text-[28px] items-center select-none">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to='/register' className="profile-element mt-4">
                            <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Sign Up
                            </div>
                        </Link>
                    </div>
                </nav>
            </header>
            <form onSubmit={handleLogin} className='auth flex flex-col justify-center items-center text-white'>
                <div className="element flex flex-col mb-1 m-0">
                    <p className="title text-indigo-600 text-3xl font-bold">Logowanie</p>
                </div>
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="username" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-user"></i><b>Użytkownik</b></label>
                    <input type="text" id="username" className="mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" name="username" required />
                </div>
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="password" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-lock"></i><b>Hasło</b></label>
                    <div className="relative">
                        <input type={passwordType} id="password" className="mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="password" required />
                        <img id="passwordImg" onClick={(e) => setPasswordType(show_hide_password(e.target, "password"))} src="password-view.svg" className="passImg absolute top-[6px] right-[10px] inline-block w-7 h-7 cursor-pointer" alt="view password" />
                    </div>
                </div>
                <div className="element flex flex-col mb-3 m-0">
                    <button type="submit" className="auth bg-[#5b48c2] text-white p-2 border-none cursor-pointer w-[140px] text-2xl" name="login_btn">Sign In</button>
                </div>
            </form>
        </>
    )
}