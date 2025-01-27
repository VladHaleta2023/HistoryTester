import React, { useEffect, useState } from "react";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { showAlert } from "../utils/showSwalAlert.js";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const TablePage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [status, setStatus] = useState(localStorage.getItem("status") || "user");
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        setStatus(localStorage.getItem("status") || "user");

        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}/data/`);
                setDatas(response.data.datas);
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

    const deleteData = async (e, dataId) => {
        e.preventDefault();

        Swal.fire({
            title: "Uwaga!",
            text: "Czy jesteś pewny, że chcesz usunąć dane?",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Usunąć",
            cancelButtonText: 'Anulować',
            cancelButtonColor: "grey",

          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosTestInstance.delete(`/${localStorage.getItem("test")}/data/${dataId}/`);

                    Swal.fire({
                        title: "Usuwanie Danych",
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate(`/${localStorage.getItem("test")}/table`);
                        }
                    });
                }
                catch (error) {
                    if (error.response) {
                        const message = error.response.data.message;
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Danych",
                                text: message,
                                icon: 'warning',
                                confirmButtonText: 'OK',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                    navigate(`/${localStorage.getItem("test")}/table`);
                                }
                            });
                        }
                    }
                    else {
                        console.error('Error:', error.message);
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Danych",
                                text: error.message,
                                icon: 'error',
                                confirmButtonText: 'OK',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                    navigate(`/${localStorage.getItem("test")}/table`);
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    return <>
        <header className="flex flex-col bg-[#1e1e1e] p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/`}>
                            <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                { status !== "user" ? (
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <Link to={`/${localStorage.getItem("test")}/table/new`}>
                                <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                    Dodać
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>) : null}
            </nav>
        </header>
        { status === "user" ? (
            <main className={`relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px]`}>
            {datas.length === 0 ? (
                <p className="font-bold text-indigo-600">Nie ma danych</p>
            ) : (
                <div>
                    {
                        datas.map((item, index) => (
                            <div key={index} id={item.data._id} className="lp-element my-2 py-3 px-5 bg-[#181d28] rounded-xl">
                                <div className="tableImages font-bold text-indigo-600 break-words text-3xl mt-2">
                                    { item.images.map((imageUrl, index) => (
                                        <img key={index} src={imageUrl} alt="Obraz" className="tablePage mb-2" />
                                    ))}
                                </div>
                                <div className="flex flex-wrap dataLP">
                                    <div className="text-indigo-600 font-bold mr-2">{item.data1Name}:</div>
                                    <div className="text-slate-300 break-words">{item.data.data1}</div>
                                </div>
                                <div className="flex flex-wrap dataLP">
                                    <div className="text-indigo-600 font-bold mr-2">{item.data2Name}:</div>
                                    <div className="text-slate-300 break-words">{item.data.data2}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
            </main>
        ) : (
            <main className={`mainDev relative p-2 text-white text-[24px] w-screen flex flex-col`}>
            {datas.length === 0 ? (
                <p className="font-bold text-indigo-600">Dodaj Dane</p>
            ) : (
                <div>
                    {
                        datas.map((item, index) => (
                            <div key={index} id={item.data._id} className="lp-element my-2 py-3 px-5 bg-[#181d28] rounded-xl">
                                <div className="tableImages font-bold text-indigo-600 break-words text-3xl mt-2">
                                    { item.images.map((imageUrl, index) => (
                                        <img key={index} src={imageUrl} alt="Obraz" className="tablePage mb-1" />
                                    ))}
                                </div>
                                <div className="flex flex-wrap dataLP">
                                    <div className="text-indigo-600 font-bold mr-2">{item.data1Name}:</div>
                                    <div className="text-slate-300 break-words">{item.data.data1}</div>
                                </div>
                                <div className="flex flex-wrap dataLP">
                                    <div className="text-indigo-600 font-bold mr-2">{item.data2Name}:</div>
                                    <div className="text-slate-300 break-words">{item.data.data2}</div>
                                </div>
                                <div className="flex flex-wrap dataLP">
                                    <div className="text-indigo-600 font-bold mr-2">Aktualizacja:</div>
                                    <div className="text-slate-300 break-words">{getDate(new Date(item.data.updatedAt))}</div>
                                </div>
                                <div className="flex flex-wrap btnsLP mt-4">
                                    <div className="profile-element mr-2 mb-2">
                                        <Link to={`/${localStorage.getItem("test")}/table/${item.data._id}`} onClick={() => {
                                            try {
                                                localStorage.setItem("data", item.data._id);
                                            }
                                            catch (err) {
                                                console.log(err);
                                            }
                                        }}>
                                            <div id={item.data._id} className="edit-element text-[20px] py-1.5 px-7 bg-[rgb(11,71,11)] text-white border-none cursor-pointer rounded-xl">Aktualizować</div>
                                        </Link>
                                    </div>
                                    <div className="profile-element mr-2 mb-2">
                                        <div id={item.data._id} onClick={(e) => deleteData(e, item.data._id)} className="delete-element text-[20px] py-1.5 px-8 bg-[rgb(105,0,0)] text-white border-none cursor-pointer rounded-xl">Usunąć</div>
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