import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from "../utils/getUser.js";
import { UserPage } from './UserPage.jsx';
import { LoginPage } from "./LoginPage.jsx";

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = localStorage.getItem('auth');

    useEffect(() => {
        fetchUser(dispatch, navigate);
    }, [dispatch, navigate]);

    return (
        <div className="text-white">
            {isAuth === "true" ? <UserPage /> : <LoginPage />}
        </div>
    )
}