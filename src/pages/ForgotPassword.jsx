import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    function onChange(e) {
        setEmail((prevState) => (e.target.value))
    }

    async function onSubmit(e) {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Reset Email Sent')
        } catch (error) {
            toast.error('Email doesn\'t exists')
        }
    }
  return (
    <section>
        <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                <img 
                className='w-full rounded-3xl'
                src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80" alt="" />
            </div>
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={onSubmit}>
                    <input placeholder='Email Address'
                    className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
                    type="email" name="" id="email" value={email} onChange={onChange} />
                    <div className='flex items-center justify-between text-sm sm:text-lg whitespace-nowrap'>
                        <p>Don't have an account? <Link to="/sign-up" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out'>Sign Up</Link></p>
                        <p>
                            <Link to="/sign-in" className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Sign In</Link>
                        </p>
                    </div>
                    <button 
                    className='mt-5 w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800'>Send Reset Password</button>
                </form>

            </div>
        </div>
    </section>
  )
}
