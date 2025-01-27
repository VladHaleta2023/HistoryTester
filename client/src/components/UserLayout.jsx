import React from "react";
import { UserNavbar } from "./UserNavbar.jsx";
import { Link, useNavigate } from 'react-router-dom';

export const UserLayout = ({children}) => {
    return (
        <div className="min-h-screen flex flex-col">
            <UserNavbar />
            {children}
        </div>
    )
}