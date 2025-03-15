import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { show_hide_password } from '../scripts/password.js';
import { showAlert } from '../utils/showSwalAlert.js';
import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import Swal from 'sweetalert2';
import { LoadingPage } from "../components/LoadingPage.jsx";
import { mainToCenter, mainToStart } from "../scripts/mainPosition.js";
import { useDispatch } from "react-redux";
import { setCredentials, setAuth, setAlert } from "../redux/reducers/authSlice.js";

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [loading, setLoading] = useState(false);
    const [textLoading, setTextLoading] = useState("Trwa Logowanie Użytkownika. Proszę zaczekać...");

    const handleLogin = async (e) => {
        e.preventDefault();

        mainToCenter(true);
        setLoading(true);
        setTextLoading("Trwa Logowanie Użytkownika. Proszę zaczekać...");

        if (!username || !password) {
            showAlert(400, "Logowanie", "Proszę wpisać Użytkownika i Hasło");
            return;
        }

        try {
            const response = await axiosAuthInstance.post('/login', { username, password });

            if (response.data.user.status !== "blocked") {
                Swal.fire({
                    title: "Logowanie",
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    localStorage.setItem('auth', "true");
                    sessionStorage.setItem('token', String(response.data.token));

                    const token = response.data.token;
                    const user = response.data.user;

                    dispatch(setCredentials({ token, user }));
                    dispatch(setAuth({ isAuthenticated: true }));

                    mainToStart(true);
                    setLoading(false);
                    navigate(`/${response.data.user}`);
                });
            }
            else {
                dispatch(setAlert({status: 400, title: "Autoryzacja", message: "Dany użytkownik jest zablokowany"}));
                dispatch(setAuth({isAuthenticated: false}));
                localStorage.setItem('auth', false);
                navigate('/');

                mainToStart(true);
                setLoading(false);

                Swal.fire({
                    title: "Logowanie",
                    text: "Dany użytkownik jest zablokowany",
                    icon: 'warning',
                    confirmButtonText: 'OK',
                }).then(() => {
                    localStorage.setItem('auth', "false");
                    navigate('/');
                });
            }
        }
        catch (error) {
            mainToStart(true);
            setLoading(false);

            dispatch(setAuth({isAuthenticated: false}));
            localStorage.setItem('auth', false);

            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                showAlert(status, "Logowanie", message);
                dispatch(setAlert({status: error.response.status, title: "Autoryzacja", message: error.response.data.message}));
            }
            else {
                showAlert("500", "Logowanie", error.message);
                dispatch(setAlert({status: 500, title: "Autoryzacja", message: error.message}));
            }
        }
    }

    return (
        <>
            <header>
                <nav className="flex header p-3.5 text-white text-[28px] items-center select-none">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to='/register' className="profile-element mt-4">
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Rejestracja
                            </div>
                        </Link>
                    </div>
                </nav>
            </header>
            <main>
                {loading ? (
                    <LoadingPage textLoading={textLoading} />
                ) : (
                <form onSubmit={handleLogin} className='auth flex flex-col justify-start pt-4 items-center text-white h-[calc(100vh-70px)]'>
                    <br></br>
                    <br></br>
                    <div className="element flex flex-col mb-1 m-0">
                        <p className="title text-indigo-600 text-3xl font-bold">Logowanie</p>
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="username" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-user"></i><b>Użytkownik</b></label>
                        <input type="text" id="username" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" name="username" required />
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="password" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-lock"></i><b>Hasło</b></label>
                        <div className="relative">
                            <input type={passwordType} id="password" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="password" required />
                            <img id="passwordImg" onClick={(e) => setPasswordType(show_hide_password(e.target, "password"))} src="password-view.svg" className="passImg absolute top-[6px] right-[10px] inline-block w-7 h-7 cursor-pointer" alt="view password" />
                        </div>
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <button type="submit" className="auth bg-[#5b48c2] text-white p-2 border-none cursor-pointer w-[180px] text-2xl" name="login_btn">Zaloguj się</button>
                    </div>
                </form>
                )}
            </main>
        </>
    )
}