import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { show_hide_password } from '../scripts/password.js';
import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import { setAlert } from "../redux/reducers/authSlice.js";
import { showAlert } from "../utils/showSwalAlert.js";
import Swal from 'sweetalert2';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [opis, setOpis] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [cpasswordType, setCPasswordType] = useState('password');
    const dispatch = useDispatch();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== cpassword) {
            showAlert(400, "Rejestracja", "Hasło i Potwierdzenie Hasła są różne");
            return;
        }

        try {
            let status = "user";
            if (username === "Admin")
                status = "admin"

            const response = await axiosAuthInstance.post('/register', { username, password, status, opis }, { withCredentials: true });

            Swal.fire({
                title: "Rejestracja",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        }
        catch (error) {
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
            <nav className="flex header p-3.5 text-white text-[28px] items-center select-none">
                <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                <div className="ml-auto relative inline-block">
                    <Link to='/' className="profile-element mt-4">
                        <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                            Sign In
                        </div>
                    </Link>
                </div>
            </nav>
            <form onSubmit={handleRegister} className="auth flex flex-col justify-start pt-4 items-center text-white h-[calc(100vh-64px)]">
                <br></br>
                <br></br>
                <div className="element flex flex-col mb-1 m-0">
                    <p className="title text-indigo-600 text-3xl font-bold">Rejestracja</p>
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
                    <label htmlFor="cpassword" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-lock"></i><b>Potwierdź Hasło</b></label>
                    <div className="relative">
                        <input type={cpasswordType} id="cpassword" className="mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Enter Confirm Password" name="password" required />
                        <img id="passwordImg" onClick={(e) => setCPasswordType(show_hide_password(e.target, "cpassword"))} src="password-view.svg" className="passImg absolute top-[6px] right-[10px] inline-block w-7 h-7 cursor-pointer" alt="view password" />
                    </div>
                </div>
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="opis" className="text-indigo-600 text-[20px] mb-1 mr-3"><i className="fa fa-user"></i><b>Opis</b></label>
                    <input type="text" id="opis" className="mb-1 p-2 border border-gray-300 rounded-md text-1xl w-[600px] text-black" value={opis} onChange={(e) => setOpis(e.target.value)} placeholder="Enter Username" name="username" required />
                </div>
                <div className="element flex flex-col mb-3 m-0">
                    <button type="submit" className="auth bg-[#5b48c2] text-white p-2 border-none cursor-pointer w-[140px] text-2xl" name="login_btn">Sign Up</button>
                </div>
            </form>
        </>
    )
}