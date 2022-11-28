import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router'

export default function OAuth() {
    const navigate = useNavigate();
    async function onGoogleClick() {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user;
            
            //check if user exists in the database
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (error) {
            toast.error('Couldn\'t authorize Google')
        }
    }
    return (
        <button onClick={onGoogleClick}
        type="button"
        className='w-full flex items-center justify-center bg-red-600 text-white 
        hover:bg-red-700 transition duration-200 ease-in-out active:bg-red-800 shadow-md hover:shadow-lg
        rounded px-7 py-3 font-semibold uppercase'>
            <FaGoogle className='mr-2'/>
            Continue with Google
        </button>
    )
}
