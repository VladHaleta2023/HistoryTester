import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from "../utils/showSwalAlert.js";
import Swal from 'sweetalert2';
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { LoadingPage } from "../components/LoadingPage.jsx";
import { mainToCenter, mainToStart } from "../scripts/mainPosition.js";

export const UpdateDataPage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [data1, setData1] = useState(localStorage.getItem("data1") || "");
    const [data2, setData2] = useState(localStorage.getItem("data2") || "");
    const [data1Name, setData1Name] = useState(localStorage.getItem("data1Name") || "Autor");
    const [data2Name, setData2Name] = useState(localStorage.getItem("data2Name") || "Nazwa");
    const [loading, setLoading] = useState(true);
    const [textLoading, setTextLoading] = useState("Pobieranie...");

    useEffect(() => {
        mainToCenter();

        const fetchDataTest = async () => {
            try {
                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}`);
                const fetchData = response.data.test;

                localStorage.setItem("data1Name", fetchData.data1Name);
                localStorage.setItem("data2Name", fetchData.data2Name);
                setData1Name(fetchData.data1Name);
                setData2Name(fetchData.data2Name);

                if (localStorage.getItem('auth') !== "true" || !localStorage.getItem("user")) 
                    navigate('/');
            } catch (error) {
                handleFetchError(error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}/data/${localStorage.getItem("data")}/`);
                const fetchData = response.data.data;

                localStorage.setItem("data1", fetchData.data1);
                localStorage.setItem("data2", fetchData.data2);
                setData1(fetchData.data1);
                setData2(fetchData.data2);
                setImages(response.data.images);
            } catch (error) {
                setLoading(false);
                handleFetchError(error);
            } finally {
                setLoading(false);
                mainToStart();
            }
        };

        fetchDataTest().then(fetchData);
    }, [navigate])

    const handleFetchError = (error) => {
        if (error.response) {
            const message = error.response.data.message;
            const status = error.response.status;
            if (localStorage.getItem('auth') === "true") showAlert(status, "Aktualizacja Testa", message);
        } else {
            if (localStorage.getItem('auth') === "true") showAlert(500, "Aktualizacja Testa", error.message);
        }
    }

    const addInputFile = () => {
        setFiles([...files, null]);
    };

    const handleFileChange = (e, index) => {
        files[index] = e.target.files[0];
        setFiles(files);
    };

    const handleUpdateData = async (e) => {
        e.preventDefault();

        setLoading(true);
        setTextLoading("Trwa aktualizowanie danych...");
        mainToCenter();

        try {
            const formData = new FormData();

            if (!data1 || !data2 || data1 === null || data2 === null) {
                setLoading(false);
                setTextLoading("Pobieranie...");
                mainToStart();

                Swal.fire({
                    title: "Aktualizacja Danych",
                    text: "Proszę wypełnić prawidłowe dane",
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            const uploadFiles = document.getElementsByClassName("uploadImageData");

            for (let i = 0; i < uploadFiles.length; i++) {
                if (uploadFiles[i].files[0]) {
                    const imageId = uploadFiles[i].id;
                    formData.set("image", uploadFiles[i].files[0]);

                    try {
                        await axiosTestInstance.put(`/${localStorage.getItem("test")}/data/${localStorage.getItem("data")}/images/${imageId}`, formData, { withCredentials: true });
                    }
                    catch (error) {
                        setLoading(false);
                        setTextLoading("Pobieranie...");
                        mainToStart();

                        if (error.response) {
                            const message = error.response.data.message;
                            if (localStorage.getItem('auth') === "true") {
                                Swal.fire({
                                    title: "Aktualizacja Danych",
                                    text: message,
                                    icon: 'warning',
                                    confirmButtonText: 'OK',
                                }).then(() => {
                                    window.location.reload();
                                    navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                                });
                            }
                        }
                        else {
                            if (localStorage.getItem('auth') === "true") {
                                Swal.fire({
                                    title: "Aktualizacja Danych",
                                    text: error.message,
                                    icon: 'error',
                                    confirmButtonText: 'OK',
                                }).then(() => {
                                    window.location.reload();
                                    navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                                });
                            }
                        }
                    }
                }
            }

            formData.delete('image');

            files.forEach((file) => {
                if (file)
                    formData.append('images', file);
            });

            formData.append('data1', data1);
            formData.append('data2', data2);

            const response = await axiosTestInstance.put(`/${localStorage.getItem("test")}/data/${localStorage.getItem("data")}/`, formData, { withCredentials: true });

            setLoading(false);
            setTextLoading("Pobieranie...");
            mainToStart();

            Swal.fire({
                title: "Aktualizacja Danych",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate(`/${localStorage.getItem("test")}/table`);
            });

            formData.delete('images');
        }
        catch (error) {
            setLoading(false);
            setTextLoading("Pobieranie...");
            mainToStart();
            
            if (error.response) {
                const message = error.response.data.message;
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Aktualizacja Danych",
                        text: message,
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        window.location.reload();
                        navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                    });
                }
            }
            else {
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Aktualizacja Danych",
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        window.location.reload();
                        navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
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

    const deleteUploadImage = (e, imageId) => {
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
                setLoading(true);
                setTextLoading("Trwa usuwanie Obraza...");
                mainToCenter();

                try {
                    const response = await axiosTestInstance.delete(`/${localStorage.getItem("test")}/data/${localStorage.getItem("data")}/images/${imageId}`, { withCredentials: true });
                
                    setLoading(false);
                    setTextLoading("Pobieranie...");
                    mainToStart();

                    Swal.fire({
                        title: "Usuwanie Obraza",
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        window.location.reload();
                        navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                    });
                }
                catch (error) {
                    setLoading(false);
                    setTextLoading("Pobieranie...");
                    mainToStart();

                    if (error.response) {
                        const message = error.response.data.message;
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Obraza",
                                text: message,
                                icon: 'warning',
                                confirmButtonText: 'OK',
                            }).then(() => {
                                window.location.reload();
                                navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                            });
                        }
                    }
                    else {
                        if (localStorage.getItem('auth') === "true") {
                            Swal.fire({
                                title: "Usuwanie Obraza",
                                text: error.message,
                                icon: 'error',
                                confirmButtonText: 'OK',
                            }).then(() => {
                                window.location.reload();
                                navigate(`/${localStorage.getItem("test")}/table/${localStorage.getItem("data")}`);
                            });
                        }
                    }
                }
            }
        });
    }

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
                            <div onClick={handleUpdateData} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
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
                <LoadingPage textLoading={textLoading} />
            ) : (<>
            <div className="mt-6">
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
                {images.map((image, index) => (
                    <div className="mt-2" key={index}>
                    <div className="element flex flex-col mb-3 m-0">
                        <img src={image.imageUrl} alt="Obraz" className="updateDataPage" />
                        <input type="file" id={image._id} className="uploadImageData bg-slate-300 mb-1 p-2 border border-gray-300 rounded-md w-[600px] text-black text-[1.2rem]" name="image" />
                        <div onClick={(e) => deleteUploadImage(e, image._id)} className="w-[120px] btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[rgb(105,0,0)] text-white border-none cursor-pointer mt-1">
                            Usunąć
                        </div>
                    </div>
                </div>
                ))}
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