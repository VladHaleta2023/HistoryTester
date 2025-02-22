import React, { useEffect, useState } from "react";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LoadingPage } from "../components/LoadingPage.jsx";
import { mainToCenter, mainToStart } from "../scripts/mainPosition.js";

export const AddTestPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [data1Name, setData1Name] = useState("Autor");
    const [data2Name, setData2Name] = useState("Nazwa");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [textLoading, setTextLoading] = useState("Pobieranie...");

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
        } else {
            Swal.fire({
                title: "Błąd",
                text: "Proszę wybrać poprawny plik graficzny",
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }

    const handleAddTest = async (e) => {
        e.preventDefault();

        setTextLoading("Trwa dodawanie testa...");
        setLoading(true);
        mainToCenter();

        try {
            const formData = new FormData();

            if (!name || !data1Name || !data2Name || name === "" || data1Name === "" || data2Name === "") {
                setLoading(false);
                setTextLoading("Pobieranie...");
                mainToStart();

                Swal.fire({
                    title: "Dodawanie Testa",
                    text: "Proszę wypełnić prawidłowe dane",
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
                
                return;
            }

            if (image)
                formData.append('image', image);
            formData.append('name', name);
            formData.append('data1Name', data1Name);
            formData.append('data2Name', data2Name);

            const response = await axiosTestInstance.post('/', formData, { withCredentials: true });

            setLoading(false);
            setTextLoading("Pobieranie...");
            mainToStart();

            Swal.fire({
                title: "Dodawanie Testa",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed)
                    navigate('/');
            });
        }
        catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                setLoading(false);
                setTextLoading("Pobieranie...");
                mainToStart();

                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Dodawanie Testa",
                        text: message,
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate('/new');
                        }
                    });
                }
            }
            else {
                console.error('Error:', error.message);
                setLoading(false);
                setTextLoading("Pobieranie...");
                mainToStart();
                
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Dodawanie Testa",
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate('/new');
                        }
                    });
                }
            }
        }
    }

    useEffect(() => {
        setLoading(true);
        mainToCenter();

        const auth = localStorage.getItem('auth');
        if (auth !== "true")
            navigate('/');

        setLoading(false);
        mainToStart();
    }, [navigate])

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={'/'}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <div onClick={handleAddTest} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Zapisz
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main className="relative p-2 text-white text-[24px] w-screen flex flex-col h-screen">
            {loading ? (
                <LoadingPage textLoading={textLoading}/>
            ) : (<>
            <div className="mt-6">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="image" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Obraz Fonowy</b></label>
                    <input type="file" id="image" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" onChange={onFileChange} name="image" />
                </div>
            </div>
            <div className="mt-2">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="name" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Nazwa Testa</b></label>
                    <input type="text" id="name" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa Testa" name="name" required />
                </div>
            </div>
            <div className="mt-2">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="data1Name" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Nazwa Pierwszej Kolumny</b></label>
                    <input type="text" id="data1Name" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" value={data1Name} onChange={(e) => setData1Name(e.target.value)} placeholder="Nazwa Pierwszej Kolumny" name="data1Name" required />
                </div>
            </div>
            <div className="mt-2">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="data2Name" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Nazwa Drugiej Kolumny</b></label>
                    <input type="text" id="data2Name" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" value={data2Name} onChange={(e) => setData2Name(e.target.value)} placeholder="Nazwa Drugiej Kolumny" name="data2Name" required />
                </div>
            </div></>)}
        </main>
    </>
}