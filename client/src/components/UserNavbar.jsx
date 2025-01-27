import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import store from "../redux/store.js";
import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import { setCredentials } from "../redux/reducers/authSlice.js";
import { showAlert } from "../utils/showSwalAlert.js";

export const UserNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState(store.getState().auth.user);
    const [username, setUsername] = useState('Guest');
    const [userId, setUserId] = useState();
    const [role, setRole] = useState();

    const teacherMenu = () => {
        if (role === "teacher") {
            return (
                <div className="bg-[#343434] text-white p-2 flex justify-end">
                    <Link to="" className="bg-[rgb(87,49,163)] py-1 px-3 text-[18px] mr-2">STATYSTYKA</Link>
                    <Link to="" className="bg-[rgb(87,49,163)] py-1 px-3 text-[18px]">DODAĆ</Link>
                </div>
            );
        }
    }

    useEffect(() => {
        
    }, []);

    const openProfileMenu = () => {
        document.getElementById("profileMenu").style.display = "flex";
        document.getElementById("profileMenu").style.animation = "0.4s 0s 1 normal none running Overlay--open";
    }

    const closeProfileMenu = () => {
        document.getElementById("profileMenu").style.animation = "0.4s 0s 1 normal none running Overlay--close";
        setTimeout(() => {
            document.getElementById("profileMenu").style.display = "none";
        }, 100);
    }

    const logOut = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosAuthInstance.post('/logOut', { withCredentials: true });
            const message = response.data.message;
            const status = response.status;

            dispatch(setCredentials({status, message}));
            showAlert(status, "Wylogowanie", message);
            navigate('/');
        }
        catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                dispatch(setCredentials({status, message}));
                showAlert(status, "Wylogowanie", message);
            }
            else {
                console.error('Error:', error.message);
                dispatch(setCredentials({status: 500, message: error.message}));
                showAlert("500", "Wylogowanie", error.message);
            }
        }
    }

    return (
        <div className="fixed w-screen">
            <nav className="flex bg-[#1e1e1e] p-2 text-white text-[28px] items-center select-none">
                <div className="ml-0 text-[rgb(116,69,209)] font-bold">GWEBTEST</div>
                <div className="ml-auto relative inline-block">
                    <img src="/images/profile.webp" alt="Profile" onClick={openProfileMenu} className="w-[48px] h-[48px] bg-[rgb(188,188,188)] rounded-full cursor-pointer min-w-[48px] min-h-[48px]"/>
                    <div id="profileMenu" className="dropdown-content hidden flex-col absolute top-[-0.5rem] right-[-0.5rem] bg-[#1e1e1e] w-[360px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.2)] p-2 z-[1]">
                        <div className="flex break-all items-start">
                            <img src="/images/profile.webp" alt="Profile" className="w-[48px] h-[48px] bg-[rgb(188,188,188)] rounded-full cursor-pointer min-w-[48px] min-h-[48px]"/>
                            <div className="ml-3 relative top-1">{username}</div>
                        </div>
                        <Link to={`/${userId}`} className="profile-element mt-4 cursor-pointer">
                            <div className="element text-[24px] py-1 px-0">
                                <i className="fa fa-address-card mr-3"></i>Główna Strona
                            </div>
                        </Link>
                        <Link to="/profile" className="profile-element mt-4 cursor-pointer">
                            <div className="element text-[24px] py-1 px-0">
                                <i className="fa fa-address-card mr-3"></i>Twój Profil
                            </div>
                        </Link>
                        <div className="profile-element mt-4 cursor-pointer" onClick={logOut}>
                            <div className="element text-[24px] py-1 px-0">
                                <i className="fa fa-address-card mr-3"></i>Wylogowanie
                            </div>
                        </div>
                        <div onClick={closeProfileMenu} className="text-white py-2 mt-4 cursor-pointer text-center bg-[rgb(87,49,163)] text-2xl">
                            Close
                        </div>
                    </div>
                </div>
            </nav>
            {teacherMenu()}
        </div>
    )
}