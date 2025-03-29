import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoadingPage } from "../components/LoadingPage.jsx";
import { mainToCenter, mainToStart } from "../scripts/mainPosition.js";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { showAlert } from "../utils/showSwalAlert.js";

export const TestStatPage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [textLoading, setTextLoading] = useState("Pobieranie...");
    const [testStats, setTestStats] = useState([]);

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

    useEffect(() => {
        window.scrollTo(0, 0);
        mainToCenter();
        setTextLoading("Pobieranie...");

        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}/stat`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                });
                setTestStats(response.data.testStats);

                setLoading(false);
                mainToStart();

                const isAuth = localStorage.getItem('auth');
                if (isAuth !== "true") {
                    navigate('/');
                }
            } 
            catch (error) {
                setLoading(false);
                mainToStart();
                
                if (error.response) {
                    const message = error.response.data.message;
                    const status = error.response.status;
                    if (localStorage.getItem('auth') === true)
                        showAlert(status, "Server", message);
                }
                else {
                    if (localStorage.getItem('auth') === true)
                        showAlert(500, "Server", error.message);
                }
            }
        }

        fetchData();
    }, [auth, navigate]);

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start" key="nav-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("user")}`}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
        <main className={`relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px] justify-center items-center`}>
            {loading ? (
                <LoadingPage textLoading={textLoading}/>
            ) : (
                <div className="flex flex-col justify-start">
                    {testStats.length === 0 ? (
                        <p className="font-bold text-indigo-600" key={"Nothing"} ></p>
                    ) : (
                        <>
                            {testStats.map((item, index) => (
                                <div key={item._id} id={item._id} className="lp-element my-2 py-3 px-5 bg-[#181d28] rounded-xl">
                                    <div className="font-bold text-white break-words text-3xl flex items-start">
                                        <div className="mt-2">{item.userId.username}</div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex flex-wrap dataLP justify-center">
                                            <div className="text-4xl mb-2">{item.bestPercent}%</div>
                                            <div className="progressBar mb-2" style={{ maxWidth: "800px", width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                                                <div
                                                    style={{
                                                        width: `${item.bestPercent}%`,
                                                        height: '20px',
                                                        backgroundColor: '#3498db',
                                                        borderRadius: '5px',
                                                        transition: 'width 1s',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap dataLP mt-2">
                                            <div className="text-indigo-600 font-bold mr-2">Klasa:</div>
                                            <div className="text-slate-300 break-words">{item.userId.class}</div>
                                        </div>
                                        <div className="flex flex-wrap dataLP">
                                            <div className="text-indigo-600 font-bold mr-2">Ilość Pytań:</div>
                                            <div className="text-slate-300 break-words">{item.userQuestionCount}</div>
                                        </div>
                                        <div className="flex flex-wrap dataLP">
                                            <div className="text-indigo-600 font-bold mr-2">Ilość Przejść:</div>
                                            <div className="text-slate-300 break-words">{item.repetitions}</div>
                                        </div>
                                        <div className="flex flex-wrap dataLP">
                                            <div className="text-indigo-600 font-bold mr-2">Aktualizacja:</div>
                                            <div className="text-slate-300 break-words">{getDate(new Date(item.updatedAt))}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </main>
    </>
}