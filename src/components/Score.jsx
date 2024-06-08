import React from 'react'

export default function Score({ title, score }) {
    return (
        <div className='flex flex-col p-2 justify-center items-center gap-4 shadow-lg bg-gray-200 rounded-lg'>
            <h2 className="text-xl text-stone-700 font-bold">{title}</h2>
            <h3 className="text-stone-700 text-2xl font-bold">{score}</h3>
        </div>
    )
}
