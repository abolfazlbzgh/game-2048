import React from 'react'

export default function Modal({onClickOk , onClickClose , src ,titleOk}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center relative">
                <img src={src} alt='game over' className='object-cover h-56 w-56 p-4' />
                <button
                    onClick={onClickOk}
                    className="bg-blue-500 hover:bg-blue-400 shadow-lg rounded-lg text-white px-4 py-2 "
                >
                    {titleOk}
                </button>
                <button
                    onClick={onClickClose}
                    className="absolute top-2 h-8 w-8 p-1 shadow-lg hover:bg-gray-300 right-2 bg-gray-200 text-black  rounded-full"
                >
                    <img src="./close.svg" alt="close" />
                </button>

            </div>
        </div>
    )
}
