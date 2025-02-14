import React from 'react';

export const LoadingPage = ({ textLoading }) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="loader w-20 h-20 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="mt-2 text-white text-lg">{textLoading}</div>
        </div>
    )
}