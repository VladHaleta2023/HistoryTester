import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { show_hide_password } from '../scripts/password.js';
import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import { showAlert } from "../utils/showSwalAlert.js";
import Swal from 'sweetalert2';
import { LoadingPage } from "../components/LoadingPage.jsx";
import { mainToCenter, mainToStart } from "../scripts/mainPosition.js";
import { setCredentials, setAuth, setAlert } from "../redux/reducers/authSlice.js";

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [classUser, setClassUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [cpasswordType, setCPasswordType] = useState('password');
    const [loading, setLoading] = useState(false);
    const [textLoading, setTextLoading] = useState("Trwa Rejestrowanie Użytkownika. Proszę zaczekać...");

    const handleRegister = async (e) => {
        e.preventDefault();

        mainToCenter(true);
        setLoading(true);
        setTextLoading("Trwa Rejestrowanie Użytkownika. Proszę zaczekać...");

        if (!username || username === "") {
            mainToStart(true);
            setLoading(false);
            showAlert(400, "Rejestracja", "Proszę wpisać Nazwę Użytkownika");
            return;
        }

        if (!classUser || classUser === "") {
            mainToStart(true);
            setLoading(false);
            showAlert(400, "Rejestracja", "Proszę wpisać Klasę");
            return;
        }

        if (!password || password === "" || !cpassword || cpassword === "") {
            mainToStart(true);
            setLoading(false);
            showAlert(400, "Rejestracja", "Proszę wpisać Hasło oraz Potwierdzenie Hasła");
            return;
        }

        if (password !== cpassword) {
            mainToStart(true);
            setLoading(false);
            showAlert(400, "Rejestracja", "Hasło i Potwierdzenie Hasła są różne");
            return;
        }

        try {
            let status = "user";
            if (username === "Admin")
                status = "admin"

            const response = await axiosAuthInstance.post('/register', { username, password, status, classUser });

            localStorage.setItem('auth', "true");

            Swal.fire({
                title: "Rejestracja",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                const token = response.data.token;
                const user = response.data.user;

                dispatch(setCredentials({ token, user }));
                dispatch(setAuth({ isAuthenticated: true }));

                mainToStart(true);
                setLoading(false);

                localStorage.setItem("user", response.data.user._id);
                sessionStorage.setItem("token", response.data.token);
                navigate(`/${response.data.user._id}`);
            });
        }
        catch (error) {
            dispatch(setAuth({isAuthenticated: false}));
            localStorage.setItem('auth', false);

            mainToStart(true);
            setLoading(false);

            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                dispatch(setAlert({status, message}));
                showAlert(status, "Rejestracja", message);
            }
            else {
                console.error('Error:', error.message);
                dispatch(setAlert({status: 500, message: error.message}));
                showAlert("500", "Rejestracja", error.message);
            }
        }
    }

    return (
        <>
            <header>
                <nav className="flex header p-3.5 text-white text-[28px] items-center select-none">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to='/' className="profile-element mt-4">
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Logowanie
                            </div>
                        </Link>
                    </div>
                </nav>
            </header>
            <main>
                {loading ? (
                    <LoadingPage textLoading={textLoading} />
                ) : (
                <form onSubmit={handleRegister} className="auth flex flex-col justify-start pt-4 items-center text-white h-[calc(100vh-64px)]">
                    <br></br>
                    <br></br>
                    <div className="element flex flex-col mb-1 m-0">
                        <p className="title text-indigo-600 text-3xl font-bold">Rejestracja</p>
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="username" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-user"></i><b>Nazwa Użytkownika</b></label>
                        <input type="text" id="username" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Wprowadź Nazwę Użytkownika" name="username" required />
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="class" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-user"></i><b>Klasa</b></label>
                        <input type="text" id="class" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={classUser} onChange={(e) => setClassUser(e.target.value)} placeholder="Wprowadź Klasę" name="classUser" required />
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="password" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-lock"></i><b>Hasło</b></label>
                        <div className="relative">
                            <input type={passwordType} id="password" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Wprowadź Hasło" name="password" required />
                            <img id="passwordImg" onClick={(e) => setPasswordType(show_hide_password(e.target, "password"))} src="password-view.svg" className="passImg absolute top-[6px] right-[10px] inline-block w-7 h-7 cursor-pointer" alt="view password" />
                        </div>
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <label htmlFor="cpassword" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-lock"></i><b>Potwierdź Hasło</b></label>
                        <div className="relative">
                            <input type={cpasswordType} id="cpassword" className="input mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Potwierdź Hasło" name="cpassword" required />
                            <img id="passwordImg" onClick={(e) => setCPasswordType(show_hide_password(e.target, "cpassword"))} src="password-view.svg" className="passImg absolute top-[6px] right-[10px] inline-block w-7 h-7 cursor-pointer" alt="view password" />
                        </div>
                    </div>
                    <div className="element flex flex-col mb-3 m-0">
                        <button type="submit" className="auth bg-[#5b48c2] text-white p-2 border-none cursor-pointer w-[180px] text-2xl" name="login_btn">Zarejestruj się</button>
                    </div>
                </form>
                )}
            </main>
        </>
    )
}