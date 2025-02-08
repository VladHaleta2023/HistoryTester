import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ResultPage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem("answers")) || []);
    const [percent, setPercent] = useState(0);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const savedAnswers = JSON.parse(localStorage.getItem("answers")) || [];
        setAnswers(savedAnswers);

        const isAuth = localStorage.getItem('auth');

        if (savedAnswers.length > 0) {
            let points = 0;
            const total = savedAnswers.length;

            for (let i = 0; i < total; i++) {
                points += savedAnswers[i].point;
            }

            setPoints(points);
            setPercent(Number(((points / total) * 100).toFixed(2)));
        } else {
            setPercent(0);
        }

        if (isAuth !== "true")
            navigate('/');
    }, [auth, navigate]);

    const autorResultComponent = (item, index) => {
        if (item.data1 === item.userData1) {
            return (
                <>
                    <tr className="bg-emerald-700 text-white" key={`autorData1-${index}-1`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data1Name")} (Twoja/Dokładna)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`autorData1-${index}-2`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.userData1}</td>
                    </tr>
                </>
            );
        }
        else {
            return (
                <>
                    <tr className="bg-red-700 text-white" key={`autorData1-${index}-1`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data1Name")} (Twoja)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`autorData1-${index}-2`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.userData1}</td>
                    </tr>
                    <tr className="bg-emerald-700 text-white" key={`autorData1-${index}-3`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data1Name")} (Dokładna)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`autorData1-${index}-4`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.data1}</td>
                    </tr>
                </>
            );
        }
    }
    
    const nameResultComponent = (item, index) => {
        if (item.data2 === item.userData2) {
            return (
                <>
                    <tr className="bg-emerald-700 text-white" key={`nameData2-${index}-1`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data2Name")} (Twoja/Dokładna)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`nameData2-${index}-2`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.userData2}</td>
                    </tr>
                </>
            );
        }
        else {
            return (
                <>
                    <tr className="bg-red-700 text-white" key={`nameData2-${index}-1`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data2Name")} (Twoja)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`nameData2-${index}-2`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.userData2}</td>
                    </tr>
                    <tr className="bg-emerald-700 text-white" key={`nameData2-${index}-3`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{localStorage.getItem("data2Name")} (Dokładna)</td>
                    </tr>
                    <tr className="bg-slate-100 text-black" key={`nameData2-${index}-4`}>
                        <td className="text-wrap py-2 px-3 sm:px-4">{item.data2}</td>
                    </tr>
                </>
            );
        }
    }
    
    const imagesResultComponent = (item, index) => {
        return (
            <>
                {item.images.map((image, imageIndex) => (
                    <tr className="bg-slate-100 text-white" key={`image-${index}-${imageIndex}`}>
                        <td className="text-wrap p-0">
                            <div>
                                <div className="element flex flex-col">
                                    <img src={image} alt="Obraz" className="resultDataPage" />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    return <>
        <header className="flex flex-col header p-3.5 text-white text-[28px] select-none fixed w-screen z-10">
            <nav>
                <div className="flex items-start" key="nav-start">
                    <div className="ml-0 text-indigo-500 font-bold">HISTORIA</div>
                    <div className="ml-auto relative inline-block">
                        <Link to={`/${localStorage.getItem("test")}/tester`} onClick={() => {
                                localStorage.removeItem("data1Name");
                                localStorage.removeItem("data2Name");
                                localStorage.removeItem("randIndex");
                                localStorage.removeItem("numbers");
                                localStorage.removeItem("answers");
                            }}>
                            <div className="btn-exit rounded-xl text-center text-[18px] py-1 px-4 bg-[#5b48c2] text-white border-none cursor-pointer">
                                Wrócić
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
        <main className={`relative p-2 text-white text-[24px] w-screen flex flex-col top-[65px]`}>
            <div className="mt-4 text-4xl mb-2">{points}/{answers.length}</div>
            <div className="text-4xl mb-2">{percent}%</div>
            <div className="progressBar mb-2" style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                <div
                    style={{
                        width: `${percent}%`,
                        height: '20px',
                        backgroundColor: '#3498db',
                        borderRadius: '5px',
                        transition: 'width 1s',
                    }}
                ></div>
            </div>
            {answers.map((item, index) => (
                <table className="w-full max-w-[600px] border border-gray-300 mx-auto mt-4 mb-2" key={`table-${index}`}>
                    <tbody>
                        {autorResultComponent(item, index)}
                        {nameResultComponent(item, index)}
                        {imagesResultComponent(item, index)}
                    </tbody>
                </table>
            ))}
        </main>
    </>
}