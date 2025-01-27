import React, { useEffect, useState } from "react";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from "../utils/showSwalAlert.js";
import Swal from 'sweetalert2';

export const UpdateTestPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [data1Name, setData1Name] = useState(localStorage.getItem("data1Name") || "Autor");
    const [data2Name, setData2Name] = useState(localStorage.getItem("data2Name") || "Nazwa");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const onFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleUpdateTest = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            if (!name || !data1Name || !data2Name || name === "" || data1Name === "" || data2Name === "") {
                Swal.fire({
                    title: "Aktualizacja Testa",
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

            const response = await axiosTestInstance.put(`/${localStorage.getItem("test")}`, formData, { withCredentials: true });

            Swal.fire({
                title: "Aktualizacja Testa",
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
                        title: "Aktualizacja Testa",
                        text: message,
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    });
                }

                return;
            }
            else {
                console.error('Error:', error.message);
                if (localStorage.getItem('auth') === "true") {
                    Swal.fire({
                        title: "Aktualizacja Testa",
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                return;
            }
        }
    }

    useEffect(() => {
        const main = document.getElementsByTagName("main")[0];
        main.style.top = String(document.getElementsByTagName("header")[0].clientHeight) + "px";

        const auth = localStorage.getItem('auth');
        if (auth !== "true")
            navigate('/');

        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}`);
                const fetchData = response.data.test;

                localStorage.setItem("name", fetchData.name);
                localStorage.setItem("data1Name", fetchData.data1Name);
                localStorage.setItem("data2Name", fetchData.data2Name);
                localStorage.setItem("imageUrl", fetchData.imageUrl);
                setName(fetchData.name);
                setData1Name(fetchData.data1Name);
                setData2Name(fetchData.data2Name);
                setImageUrl(fetchData.imageUrl);
            }
            catch (error) {
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
        }

        fetchData();
    }, [navigate])

    const deleteImage = async(e) => {
        e.preventDefault();

        Swal.fire({
            title: "Uwaga!",
            text: "Czy jesteś pewny, że chcesz usunąć Obraz Fonowy?",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Usunąć",
            cancelButtonText: 'Anulować',
            cancelButtonColor: "grey",

          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosTestInstance.delete(`/${localStorage.getItem("test")}/image`);

                    Swal.fire({
                        title: "Usuwanie Obraza Fonowego",
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            navigate(`/${localStorage.getItem("test")}`);
                        }
                    });
                }
                catch (error) {
                    if (error.response) {
                        const message = error.response.data.message;
                        const status = error.response.status;
                        if (localStorage.getItem('auth') === "true")
                            showAlert(status, "Usuwanie Obraza Fonowego", message);
                    }
                    else {
                        console.error('Error:', error.message);
                        if (localStorage.getItem('auth') === "true")
                            showAlert(500, "Usuwanie Obraza Fonowego", error.message);
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
                        <Link to={'/'}>
                            <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <div onClick={handleUpdateTest} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Zapisz
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main className="relative p-2 text-white text-[24px] w-screen flex flex-col">
            { imageUrl && imageUrl !== "null" ? (<div className="flex justify-center mt-2 flex-col">
                <img src={imageUrl} alt="Zdjęcie Fonowe" className="updateTestPage"/>
                <div className="relative flex justify-center mt-2">
                    <div onClick={deleteImage} className="w-[120px] btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[rgb(105,0,0)] text-white border-none cursor-pointer">
                        Usunąć
                    </div>
                </div>
            </div>) : null}
            <div className="mt-2">
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
            </div>
        </main>
    </>
}