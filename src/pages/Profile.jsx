import React, { useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router';

export default function Profile() {
  const navigate = useNavigate()
  const auth = getAuth();
  const [ formData, setFormData ] = useState({
    name: "Prasun",
    email: "test@gmail.com"
  })
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate('/')
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
          <h1 className='text-3xl text-center font-bold mt-6 uppercase'>My Profile</h1>
          <div className='w-full md:w-[50%] mt-5'>
            <form>
              <input type="text" placeholder='Enter Name' id='name' value={name}
              className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
              disabled
              />

            <input type="email" placeholder='Enter Email' id='email' value={email}
              className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
              disabled
              />

              <div className='flex justify-between items-center flex-nowrap text-sm sm:text-lg mb-6'>
                <p>Do you want to change your name?
                  <span 
                  className='text-red-600 hover:text-red-700 active:text-red-800 transition duration-200 ease-in-out
                  ml-1 cursor-pointer font-semibold'>
                    Edit</span>
                </p>
                <p className='text-blue-600 hover:text-blue-700 active:text-blue-800 transition duration-200 ease-in-out cursor-pointer font-semibold' onClick={onLogout}>Sign out</p>
              </div>
            </form>
          </div>
      </section>
    </>
  )
}
