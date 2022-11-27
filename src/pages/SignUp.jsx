import React, { useState } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { db } from '../firebase';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { name, email, password } = formData;
    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    async function onSubmit(e) {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            updateProfile(auth.currentUser, {
                displayName: name
            })
            console.log(user)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <section>
        <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                <img 
                className='w-full rounded-3xl'
                src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80" alt="" />
            </div>
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={onSubmit}>
                    <input placeholder='Full Name'
                    className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
                    type="text" name="" id="name" value={name} onChange={onChange} />
                    <input placeholder='Email Address'
                    className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
                    type="email" name="" id="email" value={email} onChange={onChange} />
                    <div className='relative mb-5'>
                        <input placeholder='*****'
                        className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700'
                        type={showPassword ? 'text' : "password"} name="" id="password" value={password} onChange={onChange} />
                        { showPassword ? <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer'
                        onClick={() => setShowPassword((prevState) => !prevState)}/> : 
                        <AiFillEye  className='absolute right-3 top-3 text-xl cursor-pointer'
                        onClick={() => setShowPassword((prevState) => !prevState)}/> }
                    </div>
                    <div className='flex items-center justify-between text-sm sm:text-lg whitespace-nowrap'>
                        <p>Have an account? <Link to="/sign-in" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out'>Sign In</Link></p>
                        <p>
                            <Link to="/forgot-password" className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Forgot Password?</Link>
                        </p>
                    </div>
                    <button 
                    className='mt-5 w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800'>Submit</button>
                    <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300
                    after:border-t after:flex-1 after:border-gray-300'>
                        <p className="text-center font-semibold mx-4">OR</p>
                    </div>
                    <OAuth/>
                </form>

            </div>
        </div>
    </section>
  )
}
