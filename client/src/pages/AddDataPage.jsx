import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from "../utils/showSwalAlert.js";
import Swal from 'sweetalert2';
import axiosTestInstance from "../axios/axiosTestInstance.js";

export const AddDataPage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [data1, setData1] = useState("");
    const [data2, setData2] = useState("");
    const [data1Name, setData1Name] = useState(localStorage.getItem("data1Name") || "Autor");
    const [data2Name, setData2Name] = useState(localStorage.getItem("data2Name") || "Nazwa");
    const [loading, setLoading] = useState(true);
    const [dataId, setDataId] = useState(localStorage.getItem("dataLength") || 0);

    useEffect(() => {
        const main = document.getElementsByTagName("main")[0];
        main.style.top = String(document.getElementsByTagName("header")[0].clientHeight) + "px";
        main.style.height = String(window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";

        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}`);
                const fetchData = response.data.test;

                localStorage.setItem("data1Name", fetchData.data1Name);
                localStorage.setItem("data2Name", fetchData.data2Name);
                setData1Name(fetchData.data1Name);
                setData2Name(fetchData.data2Name);
                setDataId(localStorage.getItem("dataLength") || 0);

                const auth = localStorage.getItem('auth');
                if (auth !== "true")
                    navigate('/');

                setLoading(false);
            }
            catch (error) {
                setLoading(false);

                if (error.response) {
                    const message = error.response.data.message;
                    const status = error.response.status;
                    if (localStorage.getItem('auth') === "true")
                        showAlert(status, "Aktualizacja Testa", message);
                }
                else {
                    console.error('Error:', error.message);
                    if (localStorage.getItem('auth') === "true")
                        showAlert(500, "Aktualizacja Testa", error.message);
                }
            }
            finally {
                main.style.height = String(window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";
                main.style.justifyContent = "flex-start";
            }
        }

        fetchData();
    }, [navigate])

    const addInputFile = () => {
        setFiles([...files, null]);
    };

    const handleFileChange = (e, index) => {
        files[index] = e.target.files[0];
        setFiles(files);
    };

    // Change
    const handleAddData = async (e) => {
        e.preventDefault();

        const loadingSwal = Swal.fire({
            title: "Dodawanie Danych",
            text: "Trwa dodawanie danych...",
            icon: 'info',
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const formData = new FormData();

            files.forEach((file) => {
                if (file)
                    formData.append('images', file);
            });

            formData.append('data1', data1);
            formData.append('data2', data2);

            if (!data1 || !data2 || data1 === null || data2 === null) {
                loadingSwal.close();

                Swal.fire({
                    title: "Dodawanie Danych",
                    text: "Proszę wypełnić prawidłowe dane",
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            const response = await axiosTestInstance.post(`/${localStorage.getItem("test")}/data/`, formData, { withCredentials: true });

            loadingSwal.close();

            Swal.fire({
                title: "Dodawanie Danych",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed)
                    navigate(`/${localStorage.getItem("test")}/table`);
            });
        }
        catch (error) {
            loadingSwal.close();

            if (error.response) {
                const message = error.response.data.message;
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Dodawanie Danych",
                        text: message,
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate(`/${localStorage.getItem("test")}/table/new`);
                        }
                    });
                }
            }
            else {
                console.error('Error:', error.message);
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Dodawanie Danych",
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate(`/${localStorage.getItem("test")}/table/new`);
                        }
                    });
                }
            }
        }
    };

    const handleDeleteInput = (e, index) => {
        e.preventDefault();

        Swal.fire({
            title: "Uwaga!",
            text: "Czy jesteś pewny, że chcesz usunąć Dany Obraz?",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Usunąć",
            cancelButtonText: 'Anulować',
            cancelButtonColor: "grey",

          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const newFiles = [...files].filter((_, i) => i !== index);
                    setFiles(newFiles);

                    newFiles.forEach((file, index) => {
                        const inputElement = document.getElementsByClassName("imageData")[index];

                        if (inputElement && file) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            inputElement.files = dataTransfer.files;
                        }
                        else {
                            inputElement.value = '';
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    };

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("test")}/table`}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <div onClick={handleAddData} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Zapisz
                            </div>
                        </div>
                    </div>
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <div onClick={addInputFile} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Dodać Obraz
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main className="relative p-2 text-white text-[24px] w-screen flex flex-col">
            {loading ? (
                <div>
                    <div className="loader w-20 h-20 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="mt-2 text-white text-lg">Pobieranie...</div>
                </div>
            ) : (<>
            <div className="mt-6">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="dataId" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Data Id</b></label>
                    <input type="text" id="dataId" className="bg-slate-400 mb-1 p-2 border border-gray-400 rounded-md w-[600px] text-black text-[1.2rem]" value={Number(dataId) + 1} placeholder="DataId" name="dataId" readOnly />
                </div>
            </div>
            <div className="mt-2">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="data1" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>{data1Name}</b></label>
                    <input type="text" id="data1" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" value={data1} onChange={(e) => setData1(e.target.value)} placeholder="Pierwsza Kolumna" name="data1" required />
                </div>
            </div>
            <div className="mt-2">
                <div className="element flex flex-col mb-3 m-0">
                    <label htmlFor="data2" className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>{data2Name}</b></label>
                    <input type="text" id="data2" className="bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" value={data2} onChange={(e) => setData2(e.target.value)} placeholder="Druga Kolumna" name="data2" required />
                </div>
            </div>
            <div className="text-white">
                <label className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Obrazy</b></label>
                {files.map((inputIndex, index) => (
                    <div className="mt-2" key={index}>
                        <div className="element flex flex-col mb-3 m-0">
                            <input type="file" className="imageData bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" onChange={(e) => handleFileChange(e, index)} name="image" />
                            <div onClick={(e) => handleDeleteInput(e, index)} className="w-[120px] btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[rgb(105,0,0)] text-white border-none cursor-pointer mt-1">
                                Usunąć
                            </div>
                        </div>
                    </div>
                ))}
            </div></>)}
        </main>
    </>
};