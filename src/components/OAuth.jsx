import React from 'react'
import { FaGoogle } from 'react-icons/fa'

export default function OAuth() {
    return (
        <button 
        className='w-full flex items-center justify-center bg-red-600 text-white 
        hover:bg-red-700 transition duration-200 ease-in-out active:bg-red-800 shadow-md hover:shadow-lg
        rounded px-7 py-3 font-semibold uppercase'>
            <FaGoogle className='mr-2'/>
            Continue with Google
        </button>
    )
}
