import React, { useEffect, useState, useLayoutEffect } from "react";
import axiosTestInstance from "../axios/axiosTestInstance.js";
import { showAlert } from "../utils/showSwalAlert.js";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from "../redux/reducers/testerSlice.js";
import Select from "react-select";
import Swal from 'sweetalert2';
import { mainToStart } from "../scripts/mainPosition.js";

export const TesterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const tester = useSelector((state) => state.tester);
    const [textBtnNext, setTextBtnNext] = useState("Dalej");
    const [datas, setDatas] = useState(tester?.datas || []);
    const [data1, setData1] = useState(tester?.data1Select || []);
    const [data2, setData2] = useState(tester?.data2Select || []);
    const [images, setImages] = useState([]);
    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem("answers")) || []);
    const [numbers, setNumbers] = useState(JSON.parse(localStorage.getItem("numbers")) || []);
    const [randIndex, setRandIndex] = useState(localStorage.getItem("randIndex") || 0);
    const [data1Name, setData1Name] = useState(localStorage.getItem("data1Name") || "Autor");
    const [data2Name, setData2Name] = useState(localStorage.getItem("data2Name") || "Nazwa");
    const [userAutorAnswer, setUserAutorAnswer] = useState("");
    const [userNameAnswer, setUserNameAnswer] = useState("");
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);

        const main = document.getElementsByTagName("main")[0];
        const headerHeight = document.getElementsByTagName("header")[0]?.clientHeight || 0;
    
        main.style.top = `${headerHeight}px`;
        main.style.height = `${window.innerHeight - headerHeight}px`;
    }, []);

    useEffect(() => {
        const isAuth = localStorage.getItem('auth');
        if (isAuth !== "true" || !localStorage.getItem("user")) {
            setLoading(false);
            mainToStart();
            navigate('/');
        }

        const fetchData = async () => {
            setLoading(true);

            try {
                let responseData = datas;

                if (localStorage.getItem("data") === null) {
                    localStorage.setItem("data", true);

                    const response = await axiosTestInstance.get(`/${localStorage.getItem("test")}/data/`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                        }
                    });

                    setDatas(response.data.datas);
                    responseData = response.data.datas;

                    let fetchData1 = [];
                    let fetchData2 = [];

                    for (let i = 0; i < response.data.datas.length; i++) {
                        fetchData1.push(response.data.datas[i].data.data1);
                        fetchData2.push(response.data.datas[i].data.data2);
                    }

                    fetchData1 = Array.from(new Set(fetchData1)).sort();
                    fetchData2 = Array.from(new Set(fetchData2)).sort();

                    setData1(fetchData1);
                    setData2(fetchData2);
                    
                    try {
                        localStorage.setItem("data1Name", response.data.datas[0].data1Name || "Autor");
                        localStorage.setItem("data2Name", response.data.datas[0].data2Name || "Nazwa");
                        setData1Name(responseData[0]?.data1Name || "Autor");
                        setData2Name(responseData[0]?.data2Name || "Nazwa");
                    }
                    catch (error) {
                        console.error('Error:', error.message);
                        if (localStorage.getItem('auth') === true)
                            showAlert(500, "Server", error.message);
                    }

                    localStorage.setItem('datas', JSON.stringify(responseData));
                    localStorage.setItem('data1Select', JSON.stringify(fetchData1));
                    localStorage.setItem('data2Select', JSON.stringify(fetchData2));

                    dispatch(setCredentials({
                        datas: responseData,
                        data1Select: fetchData1,
                        data2Select: fetchData2
                    }));

                    responseData = response.data.datas;
                }

                try {
                    const length = responseData.length;
                    const numbers = Array.from({ length }, (_, index) => index);

                    for (let i = numbers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                    }

                    if (!localStorage.getItem("randIndex")) {
                        localStorage.setItem("randIndex", 0);
                        setRandIndex(0);
                        localStorage.setItem('numbers', JSON.stringify(numbers)); 
                        setNumbers(numbers);
                    }
                    if (!localStorage.getItem("autorTester"))
                        localStorage.setItem("autorTester", true);
                    if (!localStorage.getItem("nameTester"))
                        localStorage.setItem("nameTester", false);
                    if (!localStorage.getItem("typeTester"))
                        localStorage.setItem("typeTester", "select");

                    if (Number(localStorage.getItem("randIndex")) === responseData.length - 1)
                        setTextBtnNext("Wyniki");
                }
                catch (error) {
                    console.error('Error:', error.message);
                    if (localStorage.getItem('auth') === true)
                        showAlert(500, "Server", error.message);
                }
            } 
            catch (error) {
                if (error.response) {
                    const message = error.response?.data?.message;
                    const status = error.response?.status;
                    if (localStorage.getItem('auth') === true)
                        showAlert(status, "Server", message);
                }
                else {
                    console.error('Error:', error.message);
                    if (localStorage.getItem('auth') === true)
                        showAlert(500, "Server", error.message);
                }
            }
            finally {
                const main = document.getElementsByTagName("main")[0];
                const headerHeight = document.getElementsByTagName("header")[0]?.clientHeight || 0;
                main.style.height = `${window.outerHeight - headerHeight}px`;
                setLoading(false);
            }
        }

        fetchData();
    }, [auth, tester, navigate, dispatch, datas, data1, data2]);

    useEffect(() => {
        const isAuth = localStorage.getItem('auth');
        if (isAuth !== "true") {
            setLoading(false);
            mainToStart();
            navigate('/');
        }

        if (Number(randIndex) > datas.length)
            localStorage.removeItem("randIndex");
        
        if (datas.length > 0 && numbers.length > 0) {
            const currentData = datas[numbers[randIndex]];
            if (currentData && currentData.images) {
                setLoading(true);
                const imagePromises = currentData.images.map((src) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                });
    
                Promise.all(imagePromises)
                    .then(() => {
                        setImages(currentData.images);
                    })
                    .catch((error) => console.error("Błąd Pobierania Obraza:", error))
                    .finally(() => {setLoading(false)});
    
                if (localStorage.getItem("autorTester") === "false") {
                    setUserAutorAnswer(currentData.data.data1);
                } else if (localStorage.getItem("typeTester") === "select" && data1.length > 0) {
                    setUserAutorAnswer(data1[0]);
                } else {
                    setUserAutorAnswer("");
                }
    
                if (localStorage.getItem("nameTester") === "false") {
                    setUserNameAnswer(currentData.data.data2);
                } else if (localStorage.getItem("typeTester") === "select" && data2.length > 0) {
                    setUserNameAnswer(data2[0]);
                } else {
                    setUserNameAnswer("");
                }
            }
        }
    }, [datas, numbers, randIndex, data1, data2, navigate]);

    const getAutorOptions = () => {
        let resData = [];

        for (let i = 0; i < data1.length; i++) {
            resData.push({
                value: data1[i],
                label: data1[i]
            });
        }

        return resData;
    }

    const getNameOptions = () => {
        let resData = [];

        for (let i = 0; i < data2.length; i++) {
            resData.push({
                value: data2[i],
                label: data2[i]
            });
        }

        return resData;
    }

    const autorOptions = getAutorOptions();
    const nameOptions = getNameOptions();

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

    const changeUserAutorAnswer = (selectedOption) => {
        const { value } = selectedOption;

        setUserAutorAnswer(value);
    }

    const changeUserNameAnswer = (selectedOption) => {
        const { value } = selectedOption;

        setUserNameAnswer(value);
    }

    const autorComponent = () => {
        if (localStorage.getItem("autorTester") === null || 
            localStorage.getItem("nameTester") === null ||
            localStorage.getItem("typeTester") === null) {
                return null;
            }

        if (localStorage.getItem("autorTester") === "true") {
            if (localStorage.getItem("typeTester") === "select") {
                return (
                    <Select
                        className="selectTester"
                        value={
                            autorOptions.length > 0
                                ? { value: userAutorAnswer, label: userAutorAnswer }
                                : null
                        }
                        onChange={(selectedOption) => changeUserAutorAnswer(selectedOption)}
                        styles={customStyles}
                        menuPlacement="bottom"
                        options={autorOptions}
                        defaultValue={
                            autorOptions.length > 0 ? autorOptions[0] : null
                        }
                        isLoading={autorOptions.length === 0}
                        isSearchable={false}
                    />
                );
            }
            else {
                return (
                    <textarea name="textarea" id="autorTextarea" rows="5" value={userAutorAnswer} onChange={(e) => {setUserAutorAnswer(e.target.value)}}></textarea>
                );
            }
        }
        else {
            return (
                <div className="text-white break-words">{userAutorAnswer}</div>
            );
        }
    }

    const nameComponent = () => {
        if (localStorage.getItem("autorTester") === null || 
            localStorage.getItem("nameTester") === null ||
            localStorage.getItem("typeTester") === null) {
            return null;
        }

        if (localStorage.getItem("nameTester") === "true") {
            if (localStorage.getItem("typeTester") === "select") {
                return (
                    <Select
                        className="selectTester"
                        value={
                            nameOptions.length > 0
                                ? { value: userNameAnswer, label: userNameAnswer }
                                : null
                        }
                        onChange={(selectedOption) => changeUserNameAnswer(selectedOption)}
                        styles={customStyles}
                        menuPlacement="bottom"
                        options={nameOptions}
                        defaultValue={
                            nameOptions.length > 0 ? nameOptions[0] : null
                        }
                        isLoading={nameOptions.length === 0}
                        isSearchable={false}
                    />
                );
            }
            else {
                return (
                    <textarea name="textarea" id="nameTextarea" rows="5" value={userNameAnswer} onChange={(e) => {setUserNameAnswer(e.target.value)}}></textarea>
                );
            }
        }
        else {
            return (
                <div className="text-white break-words">{userNameAnswer}</div>
            );
        }
    }

    const handleNext = (e) => {
        e.preventDefault();

        const correctAutor = datas[numbers[randIndex]].data.data1;
        const correctName = datas[numbers[randIndex]].data.data2;

        if (Number(randIndex) + 1 > datas.length)
            localStorage.setItem("randIndex", 0);
        else
            localStorage.setItem("randIndex", Number(randIndex) + 1);

        if (userAutorAnswer === correctAutor && userNameAnswer === correctName) {
            answers.push({
                userData1: userAutorAnswer,
                userData2: userNameAnswer,
                data1: correctAutor,
                data2: correctName,
                images: images,
                point: 1
            });
    
            setAnswers(localStorage.setItem('answers', JSON.stringify(answers))); 

            Swal.fire({
                title: "Prawidłowo",
                text: "",
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                if (Number(localStorage.getItem("randIndex")) >= datas.length)
                    navigate(`/${localStorage.getItem("test")}/result`);
                window.location.reload();
            });
        }
        else {
            let message = "";

            if (userAutorAnswer !== correctAutor)
                message += `<div>${data1Name}: ${correctAutor}</div>`;
            if (userNameAnswer !== correctName)
                message += `<div>${data2Name}: ${correctName}</div>`;

            answers.push({
                userData1: userAutorAnswer,
                userData2: userNameAnswer,
                data1: correctAutor,
                data2: correctName,
                images: images,
                point: 0
            });
    
            setAnswers(localStorage.setItem('answers', JSON.stringify(answers))); 

            Swal.fire({
                title: "Nie prawidłowo",
                html: message,
                icon: 'error',
                confirmButtonText: 'OK',
            }).then(() => {
                if (Number(localStorage.getItem("randIndex")) >= datas.length)
                    navigate(`/${localStorage.getItem("test")}/result`);
                window.location.reload();
            });
        }
    }

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("user")}`} onClick={() => {
                                localStorage.removeItem("data1Name");
                                localStorage.removeItem("data2Name");
                                localStorage.removeItem("randIndex");
                                localStorage.removeItem("numbers");
                                localStorage.removeItem("autorTester");
                                localStorage.removeItem("nameTester");
                                localStorage.removeItem("typeTester");
                                localStorage.removeItem("answers");
                                localStorage.removeItem("data");
                            }}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="ml-0 flex items-center justify-start mt-4">
                    <div className="relative inline-block mr-2">
                        <div className="profile-element">
                            <div onClick={handleNext} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                {textBtnNext}
                            </div>
                        </div>
                    </div>
                    {Number(randIndex) === 0 ? (
                        <div className="relative inline-block mr-2">
                            <div className="profile-element">
                                <Link to={`/${localStorage.getItem("test")}/settings`}>
                                    <div className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                        Ustawienia
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>
            </nav>
        </header>
        <main className={`mainDev relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px] ${loading ? "justify-center items-center h-screen" : "justify-start"}`}>
            {loading ? (
                <div>
                    <div className="loader w-20 h-20 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="mt-2 text-white text-lg">Pobieranie...</div>
                </div>
            ) : (<>
            <h1>{Number(randIndex) + 1}/{numbers.length}</h1>
            <div className="mt-2">
                <div id="userAutorTester" className="elementTester flex flex-col mb-3 m-0">
                    <div className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>{data1Name}</b></div>
                    {autorComponent()}
                </div>
            </div>
            <div className="mt-2">
                <div className="elementTester flex flex-col mb-3 m-0">
                    <div className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>{data2Name}</b></div>
                    {nameComponent()}
                </div>
            </div>
            <div className="text-white mt-3">
                {images.map((image, index) => (
                    <div key={index}>
                        <div className="element flex flex-col m-0">
                            <img src={image} alt="Obraz" className="updateDataPage" />
                        </div>
                    </div>
                ))}
            </div></>)}
        </main>
    </>
}