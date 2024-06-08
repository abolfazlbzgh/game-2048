import React from 'react'

export default function Button({onClick , src , rotate=''}) {
    return (
        <button onClick={onClick} className={`bg-gray-200 shadow-lg rounded-lg w-11 h-11 p-2 ${rotate} hover:bg-gray-300 transition-all`}>
            <img src={src} alt="icon" />
        </button>
    )
}
