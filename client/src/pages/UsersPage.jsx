import React, { useEffect, useState } from "react";
import axiosAuthInstance from "../axios/axiosAuthInstance.js";
import { showAlert } from "../utils/showSwalAlert.js";
import { useNavigate, Link } from 'react-router-dom';
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { setAlert } from "../redux/reducers/authSlice.js";
import Swal from 'sweetalert2';

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const statusOptions = [
        { value: "user", label: "User" },
        { value: "teacher", label: "Teacher" },
        { value: "blocked", label: "Blocked" }
    ];

    const handleChangeStatus = async (selectedOption, userId) => {
        const { value } = selectedOption;

        try {
            const response = await axiosAuthInstance.put(`/${userId}`, { status: value }, { withCredentials: true });
            Swal.fire({
                title: "Aktualizacja użytkownika",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.reload();
                navigate('/users');
            });
        }
        catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                dispatch(setAlert({status, message}));
                showAlert(status, "Aktualizacja użytkownika", message);
            }
            else {
                console.error('Error:', error.message);
                dispatch(setAlert({status: 500, message: error.message}));
                showAlert("500", "Aktualizacja użytkownika", error.message);
            }
        }
    }

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: "white",
          border: "1px solid #ccc",
          paddingLeft: "0px",
          boxShadow: "none",
          "&:hover": {
            border: "1px solid #888",
          },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? "transparent" : "white",
          color: state.isFocused ? "black" : "inherit",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }),
    };

    useEffect(() => {
        const main = document.getElementsByTagName("main")[0];
        main.style.top = String(document.getElementsByTagName("header")[0].clientHeight) + "px";

        const auth = localStorage.getItem('auth');
        if (auth !== "true" || !localStorage.getItem("user"))
            navigate('/');

        const fetchData = async () => {
            try {
                const response = await axiosAuthInstance.get("/");
                setUsers(response.data.users);
            }
            catch (error) {
                if (error.response) {
                    const message = error.response.data.message;
                    const status = error.response.status;
                    if (localStorage.getItem('auth') === "true")
                        showAlert(status, "Uzyskanie użytkowników", message);
                }
                else {
                    console.error('Error:', error.message);
                    if (localStorage.getItem('auth') === "true")
                        showAlert(500, "Uzyskanie użytkowników", error.message);
                }
            }
        }

        fetchData();
    }, [navigate])

    const getStatus = (status) => {
        switch (status) {
            case "user":
                return { value: "user", label: "User" };
            case "teacher":
                return { value: "teacher", label: "Teacher" };
            case "blocked":
                return { value: "blocked", label: "Blocked" };
            default:
                return null;
        }
    }

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("user")}`}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="ml-0 flex flex-wrap items-center justify-start">
                    <div className="relative inline-block mr-2 mt-4">
                        <div className="profile-element">
                            <Link to={'/users'}>
                                <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                    Użytkownicy
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="relative inline-block mr-2 mt-4">
                        <div className="profile-element">
                            <Link to={'/admin/tests'}>
                                <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                    Testy
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main className="relative p-2 text-white text-[24px] w-screen flex justify-center items-center text-center">
            {users.length > 0 ? (
                <table className="text-start max-w-[600px] w-[calc(100vw)] border border-gray-300 mx-auto mt-4 mb-2">
                    <thead className="bg-[#5b48c2] text-white select-none">
                        <tr>
                            <th className="text-start">Użytkownik</th>
                            <th className="text-start max-w-[170px] w-[170px]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className="bg-slate-100 text-black">
                                        <td className="text-wrap">{item.username}</td>
                                        <td className="max-w-[170px] w-[170px]">
                                            <Select
                                                className="select"
                                                value={getStatus(item.status)}
                                                styles={customStyles}
                                                options={statusOptions}
                                                menuPlacement="bottom"
                                                onChange={(selectedOption) => handleChangeStatus(selectedOption, item._id)}
                                            />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        }
                    </tbody>
                </table>
            ) : (
                <p className="font-bold text-indigo-600">Nie ma użytkowników</p>
            )}
        </main>
    </>
}