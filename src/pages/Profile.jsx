import React, { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { FcHome } from "react-icons/fc"
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ListingItem from '../components/ListingItem';

export default function Profile() {
  const navigate = useNavigate()
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ formData, setFormData ] = useState({
    name: "Prasun",
    email: "test@gmail.com"
  })
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate('/')
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        //Update Display Username
        await updateProfile(auth.currentUser, {
          displayName: name
        })
      }

      //Update Name in the Firestore
      const docRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(docRef, {
        name
      })

      toast.success("Profile Details Updated")
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, 
        where('userRef',  "==", auth.currentUser.uid), 
        orderBy('timestamp', 'desc'));
      const querySnap = await getDocs(q)
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
            id: doc.id,
            data: doc.data()
          })
      });
      setListings(listings)
      console.log(listings)
      setLoading(false)
    }
    fetchUserListings();
  }, [auth.currentUser.uid])

  async function onDelete(listingID) {
    if(window.confirm("Are you want to delete?")) {
      await deleteDoc(doc(db, 'listings', listingID))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      )
      setListings(updatedListings)
      toast.success("Deleted Successfully")
    }
  }

  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`)
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
          <h1 className='text-3xl text-center font-bold mt-6 uppercase'>My Profile</h1>
          <div className='md:w-[50%] mt-5 mx-3'>
            <form>
              <input type="text" placeholder='Enter Name' id='name' value={name}
              className={`w-full px-4 py-2 text-xl rounded bg-white border-gray-300 
              transition ease-in-out text-gray-700 mb-5 ${changeDetail && "bg-red-300"} focus:bg-white`}
              disabled={!changeDetail}
              onChange={onChange}
              />

            <input type="email" placeholder='Enter Email' id='email' value={email}
              className='w-full px-4 py-2 text-xl rounded bg-white border-gray-300 transition ease-in-out text-gray-700 mb-5'
              disabled
              />

              <div className='flex justify-between items-center flex-nowrap text-sm sm:text-lg mb-6'>
                <p>Do you want to change your name?
                  <span 
                  className='text-red-600 hover:text-red-700 active:text-red-800 transition duration-200 ease-in-out
                  ml-1 cursor-pointer font-semibold'
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}>
                    {changeDetail ? 'Apply Change' : 'Edit'}</span>
                </p>
                <p className='text-blue-600 hover:text-blue-700 active:text-blue-800 transition duration-200 ease-in-out cursor-pointer font-semibold' onClick={onLogout}>Sign out</p>
              </div>
            </form>
            <button
            type='submit'
            className='w-full bg-blue-600 text-white uppercase rounded-md text-sm font-medium py-3
            shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition ease-in-out duration-200'>
              <Link 
              to="/create-listing"
              className='flex items-center justify-center'>
                <FcHome 
                className='mr-1 text-3xl bg-red-400 rounded-full p-1 border-2'/>
                Sell or rent your home
              </Link>
            </button>
          </div>
      </section>
      <div className='max-w-6xl px-3 pt-6'>
        {!loading && listings.length > 0 && 
          <>
            <h2 className='text-2xl text-center font-semibold uppercase'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              { listings.map((listing) => (
                <ListingItem 
                key={listing.id}
                id={listing.id}
                listing={listing.data}
                onDelete={()=>onDelete(listing.id)}
                onEdit={()=>onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        }
      </div>
    </>
  )
}
