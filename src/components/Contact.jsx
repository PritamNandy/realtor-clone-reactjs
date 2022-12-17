import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function Contact({userRef, listing}) {
  const [landLord, setLandLord] = useState(null)
  const [message, setMessage] = useState("")
  useEffect(()=>{
    async function getLandLord() {
      const docRef = doc(db, 'users', userRef);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setLandLord(docSnap.data())
      } else {
        toast.error("Could not get landlord data")
      }
    }
    getLandLord()
  }, [userRef])
  function onChange(e) {
    setMessage(e.target.value)
  }
    return (
    <>
      {landLord !== null && (
        <div
        className='flex flex-col w-full'>
          <p
          className=""
          >Contact {landLord.name} for the {listing.name.toLowerCase()}</p>
          <div>
            <textarea
            className='w-full px-4 py-2 text-lg text-gray-700 mt-3
            bg-white border border-gray-800 rounded-md transition duration-150 ease-in-out
            shadow-md focus:text-gray-700 focus:bg-white focus:shadow-lg focus:border-slate-600' 
            onChange={onChange}
            name='message' id="message" rows="2" placeholder="Message"
            value={message}></textarea>
          </div>
          <a
          href={`mailto:${landLord.email}?subject=${listing.name}&body=${message}`}>
            <button
            className='px-7 py-3 text-center uppercase text-sm bg-blue-600 text-white
            font-semibold w-full rounded-md mt-5 shadow-md hover:bg-blue-700 hover:shadow-lg
            focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-xl
            transition ease-in-out duration-150 mb-5'
            >Send Message</button>
          </a>
        </div>
      )}
    </>
  )
}
