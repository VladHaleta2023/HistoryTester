import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from "react-select";
import Swal from 'sweetalert2';

export const TesterSettingsPage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [typeTester, setTypeTester] = useState(localStorage.getItem("typeTester") || "select");
    const [autorTester, setAutorTester] = useState(localStorage.getItem("autorTester") || "true");
    const [nameTester, setNameTester] = useState(localStorage.getItem("nameTester") || "false");

    const datasTypeOptions = [
        { value: "Nic", label: "Nic" },
        { value: "Tylko Pierwszą Kolumnę", label: "Tylko Pierwszą Kolumnę" },
        { value: "Tylko Drugą Kolumnę", label: "Tylko Drugą Kolumnę" },
        { value: "Wszystko", label: "Wszystko" }
    ];

    const typeTesterOptions = [
        { value: "Select", label: "Select" },
        { value: "Text Area", label: "Text" }
    ];

    useEffect(() => {
        const isAuth = localStorage.getItem('auth');

        setAutorTester(localStorage.getItem("autorTester") || "true");
        setNameTester(localStorage.getItem("nameTester") || "false");
        setTypeTester(localStorage.getItem("typeTester") || "true");

        if (isAuth !== "true")
            navigate('/');
    }, [auth, navigate]);

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

    const getDatasSettings = () => {
        if (autorTester === "true" && nameTester === "true") {
            return { value: "Nic", label: "Nic" }
        }
        else if (autorTester !== "true" && nameTester === "true") {
            return { value: "Tylko Pierwszą Kolumnę", label: "Tylko Pierwszą Kolumnę" }
        }
        else if (autorTester === "true" && nameTester !== "true") {
            return { value: "Tylko Drugą Kolumnę", label: "Tylko Drugą Kolumnę" }
        }
        else {
            return { value: "Wszystko", label: "Wszystko" }
        }
    }

    const getTesterSettings = () => {
        if (typeTester === "select") {
            return { value: "Select", label: "Select" }
        }
        else {
            return { value: "Text Area", label: "Text" }
        }
    }

    const changeTypeTesterSettings = (selectedOption) => {
        const { value } = selectedOption;

        if (value === "Select") {
            setTypeTester("select");
        }
        else {
            setTypeTester("text");
        }
    }

    const changeData1Settings = (selectedOption) => {
        const { value } = selectedOption;

        if (value === "Nic") {
            setAutorTester("true");
            setNameTester("true");
        }
        else if (value === "Tylko Pierwszą Kolumnę") {
            setAutorTester("false");
            setNameTester("true");
        }
        else if (value === "Tylko Drugą Kolumnę") {
            setAutorTester("true");
            setNameTester("false");
        }
        else {
            setAutorTester("false");
            setNameTester("false");
        }
    }

    const saveSettings = () => {
        localStorage.setItem("autorTester", String(autorTester));
        localStorage.setItem("nameTester", String(nameTester));
        localStorage.setItem("typeTester", String(typeTester));

        Swal.fire({
            title: "Ustawienia Testa",
            text: "Aktualizacja udana",
            icon: 'success',
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("test")}/tester`} onClick={() => {
                            localStorage.removeItem("randIndex");
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
                            <div onClick={saveSettings} className="btnUser rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Zapisz
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main className={`mainDev relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px]`}>
            <div className="mt-6">
                <div id="userAutorTester" className="elementTester flex flex-col mb-3 m-0">
                    <div className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Wiemy</b></div>
                    <Select
                        className="selectTester"
                        value={getDatasSettings()}
                        onChange={(selectedOption) => changeData1Settings(selectedOption)}
                        styles={customStyles}
                        menuPlacement="bottom"
                        options={datasTypeOptions}
                        defaultValue={getDatasSettings()}
                    />
                </div>
            </div>
            <div className="mt-2">
                <div className="elementTester flex flex-col mb-3 m-0">
                    <div className="inputTitle text-indigo-600 text-[20px] mb-1 mr-3"><b>Typ</b></div>
                    <Select
                        className="selectTester"
                        value={getTesterSettings()}
                        onChange={(selectedOption) => changeTypeTesterSettings(selectedOption)}
                        styles={customStyles}
                        menuPlacement="bottom"
                        options={typeTesterOptions}
                        defaultValue={getTesterSettings()}
                    />
                </div>
            </div>
        </main>
    </>
}