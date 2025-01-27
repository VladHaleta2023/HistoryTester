import React, { useEffect, useState } from "react";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import axiosAuthInstance from "../axios/axiosAuthInstance.js";
import { showAlert } from "../utils/showSwalAlert.js";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from "../redux/reducers/authSlice.js";
import Swal from 'sweetalert2';

export const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [status, setStatus] = useState(auth?.user?.status || "user");
    const [tests, setTests] = useState([]);

    useEffect(() => {
        setStatus(auth?.user?.status || "user");
        localStorage.setItem("status", auth?.user?.status || "user");

        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get("/");
                setTests(response.data.tests);
            } 
            catch (error) {
                if (error.response) {
                    const message = error.response.data.message;
                    const status = error.response.status;
                    if (localStorage.getItem('auth') === true)
                        showAlert(status, "Server", message);
                }
                else {
                    console.error('Error:', error.message);
                    if (localStorage.getItem('auth') === true)
                        showAlert(500, "Server", error.message);
                }
            }
        }

        fetchData();

        const isAuth = localStorage.getItem('auth');
        if (isAuth !== "true")
            navigate('/');
    }, [auth, navigate]);

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosAuthInstance.post('/logOut', { withCredentials: true });
            dispatch(setAlert({status: response.status, title: "Wylogowanie", message: response.data.message}));
            localStorage.removeItem('admin');
            localStorage.setItem('auth', false);
            Swal.fire({
                title: "Wylogowanie",
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
        catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                const status = error.response.status;
                showAlert(status, "Wylogowanie", message);
            }
            else {
                console.error('Error:', error.message);
                showAlert("500", "Wylogowanie", error.message);
            }
        }
        finally {
            localStorage.clear();
        }
    }

    const deleteTest = async (e, testId) => {
        e.preventDefault();

        Swal.fire({
            title: "Uwaga!",
            text: "Czy jesteś pewny, że chcesz usunąć test?",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Usunąć",
            cancelButtonText: 'Anulować',
            cancelButtonColor: "grey",

          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosTestInstance.delete(`/${localStorage.getItem("test")}`);

                    Swal.fire({
                        title: "Usuwanie Testa",
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate(`/`);
                        }
                    });
                }
                catch (error) {
                    if (error.response) {
                        const message = error.response.data.message;
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Testa",
                                text: message,
                                icon: 'warning',
                                confirmButtonText: 'OK',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                    navigate(`/`);
                                }
                            });
                        }
                    }
                    else {
                        console.error('Error:', error.message);
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Testa",
                                text: error.message,
                                icon: 'error',
                                confirmButtonText: 'OK',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                    navigate(`/`);
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    const getDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    return <>
        <header className="flex flex-col bg-[#1e1e1e] p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <div onClick={handleSignOut} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                            Sign Out
                        </div>
                    </div>
                </div>
                { status !== "user" ? (
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <Link to={'/new'}>
                                <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                    Dodać
                                </div>
                            </Link>
                        </div>
                    </div>
                { status === "admin" ? (
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <Link to={'/users'}>
                                <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                    Użytkownicy
                                </div>
                            </Link>
                        </div>
                    </div>) : null}
                </div>) : null}
            </nav>
        </header>
        { status === "user" ? (
            <main className={`relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px]`}>
            {tests.length === 0 ? (
                <p className="font-bold text-indigo-600">Nie ma testów</p>
            ) : (
                <div>
                    {
                        tests.map((item, index) => (
                            <div key={index} id={item._id} className="lp-element my-2 py-3 px-5 bg-[#181d28] rounded-xl">
                                <div className="font-bold text-indigo-600 break-words text-3xl mt-2 flex items-start">
                                    { item.imageUrl && item.imageUrl !== "null" ? (<div className="flex justify-center mr-2">
                                        <img src={item.imageUrl} alt="Zdjęcie Fonowe" className="userPage" />
                                    </div>) : null}
                                    <div className="mt-2">{item.name}</div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-wrap dataLP mt-2">
                                        <div className="text-indigo-600 font-bold mr-2">Aktualizacja:</div>
                                        <div className="text-slate-300 break-words">{getDate(new Date(item.updatedAt))}</div>
                                    </div>
                                    <div className="flex flex-wrap btnsLP mt-2">
                                        <div className="profile-element mr-2 mb-2">
                                            <Link to={`/${item._id}/table`} onClick={() => {
                                                try {
                                                    localStorage.setItem("test", item._id);
                                                }
                                                catch (err) {
                                                    console.log(err);
                                                }
                                            }}>
                                                <div id={item._id} className="table-element text-[20px] py-1.5 px-7 bg-[#5b48c2] text-white border-none cursor-pointer rounded-xl">Tabela</div>
                                            </Link>
                                        </div>
                                        <div className="profile-element mr-2 mb-2">
                                            <Link to={`/${item._id}/tester`} onClick={() => {
                                                try {
                                                    localStorage.setItem("test", item._id);
                                                }
                                                catch (err) {
                                                    console.log(err);
                                                }
                                            }}>
                                                <div id={item._id} className="table-element text-[20px] py-1.5 px-7 bg-[#5b48c2] text-white border-none cursor-pointer rounded-xl">Start</div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
            </main>
        ) : (
            <main className={`mainDev relative p-2 text-white text-[24px] w-screen flex flex-col`}>
                {tests.length === 0 ? (
                    <p className="font-bold text-indigo-600">Dodaj Test</p>
                ) : (
                    <div>
                        {
                            tests.map((item, index) => (
                                <div key={index} id={item._id} className="lp-element my-2 py-3 px-5 bg-[#181d28] rounded-xl">
                                    <div className="font-bold text-indigo-600 break-words text-3xl mt-2 flex items-start">
                                        { item.imageUrl && item.imageUrl !== "null" ? (<div className="flex justify-center mr-2">
                                            <img src={item.imageUrl} alt="Zdjęcie Fonowe" className="userPage" />
                                        </div>) : null}
                                        <div className="mt-2">{item.name}</div>
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap dataLP mt-1">
                                            <div className="text-indigo-600 font-bold mr-2">Pierwsza Kolumna:</div>
                                            <div className="text-slate-300 break-words">{item.data1Name}</div>
                                        </div>
                                        <div className="flex flex-wrap dataLP">
                                            <div className="text-indigo-600 font-bold mr-2">Druga Kolumna:</div>
                                            <div className="text-slate-300 break-words">{item.data2Name}</div>
                                        </div>
                                        <div className="flex flex-wrap dataLP">
                                            <div className="text-indigo-600 font-bold mr-2">Aktualizacja:</div>
                                            <div className="text-slate-300 break-words">{getDate(new Date(item.updatedAt))}</div>
                                        </div>
                                        <div className="flex flex-wrap btnsLP mt-2">
                                            <div className="profile-element mr-2 mb-2">
                                                <Link to={`/${item._id}`} onClick={() => {
                                                    try {
                                                        localStorage.setItem("test", item._id);
                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                }}>
                                                    <div id={item._id} className="edit-element text-[20px] py-1.5 px-7 bg-[rgb(11,71,11)] text-white border-none cursor-pointer rounded-xl">Aktualizować</div>
                                                </Link>
                                            </div>
                                            <div className="profile-element mr-2 mb-2">
                                                <div id={item._id} onClick={(e) => deleteTest(e, item._id)} className="delete-element text-[20px] py-1.5 px-8 bg-[rgb(105,0,0)] text-white border-none cursor-pointer rounded-xl">Usunąć</div>
                                            </div>
                                            <div className="profile-element mr-2 mb-2">
                                                <Link to={`/${item._id}/table`} onClick={() => {
                                                    try {
                                                        localStorage.setItem("test", item._id);
                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                }}>
                                                    <div id={item._id} className="table-element text-[20px] py-1.5 px-7 bg-[#5b48c2] text-white border-none cursor-pointer rounded-xl">Tabela</div>
                                                </Link>
                                            </div>
                                            <div className="profile-element mr-2 mb-2">
                                                <Link to={`/${item._id}/tester`} onClick={() => {
                                                    try {
                                                        localStorage.setItem("test", item._id);
                                                    }
                                                    catch (err) {
                                                        console.log(err);
                                                    }
                                                }}>
                                                    <div id={item._id} className="table-element text-[20px] py-1.5 px-7 bg-[#5b48c2] text-white border-none cursor-pointer rounded-xl">Start</div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </main>
        )}
    </>
}