import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import { db } from '../firebase'
import ListingItem from '../components/ListingItem'

export default function Home() {
  //Offers
  const [offerListings, setOfferListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, where("offer", '==', true), orderBy('timestamp', 'desc'), limit(4))
        const docSnap = await getDocs(q)
        let offerListings = [];
        docSnap.forEach((data) => {
          offerListings.push({
            id: data.id,
            data: data.data() 
          })
        })
        setOfferListings(offerListings) 
        console.log(offerListings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchListings();
  }, [])

  //Rents
  const [rentListings, setRentListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, where("type", '==', 'rent'), orderBy('timestamp', 'desc'), limit(4))
        const docSnap = await getDocs(q)
        let rentListings = [];
        docSnap.forEach((data) => {
          rentListings.push({
            id: data.id,
            data: data.data() 
          })
        })
        setRentListings(rentListings) 
        console.log(rentListings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchListings();
  }, [])

  //Sells
  const [sellListings, setSellListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, where("type", '==', 'sale'), orderBy('timestamp', 'desc'), limit(4))
        const docSnap = await getDocs(q)
        let sellListings = [];
        docSnap.forEach((data) => {
          sellListings.push({
            id: data.id,
            data: data.data() 
          })
        })
        setSellListings(sellListings) 
        console.log(sellListings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchListings();
  }, [])
  return (
    <div>
      <Slider/>
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {offerListings && offerListings.length > 0 && (
          <div className='m-2 mb-3'>
            <h2 className='px-2 mt-6 uppercase font-bold text-2xl'>Recent Offers</h2>
            <Link to="/offers">
              <p className='px-2 text-sm font-semibold text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out'>Show more offers</p>
            </Link>
            <ul className='grid sm:grid-cols-2 md:grid-cols-4'>
              {offerListings.map((listing) => (
                <li>
                  <ListingItem 
                  listing = {listing.data}
                  id = {listing.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {rentListings && rentListings.length > 0 && (
          <div className='m-2 mb-3'>
            <h2 className='px-2 mt-6 uppercase font-bold text-2xl'>Recent Rents</h2>
            <Link to="/category/rent">
              <p className='px-2 text-sm font-semibold text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out'>Show more offers</p>
            </Link>
            <ul className='grid sm:grid-cols-2 md:grid-cols-4'>
              {rentListings.map((listing) => (
                <li>
                  <ListingItem 
                  listing = {listing.data}
                  id = {listing.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {sellListings && sellListings.length > 0 && (
          <div className='m-2 mb-3'>
            <h2 className='px-2 mt-6 uppercase font-bold text-2xl'>Recent Sales</h2>
            <Link to="/category/sale">
              <p className='px-2 text-sm font-semibold text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out'>Show more offers</p>
            </Link>
            <ul className='grid sm:grid-cols-2 md:grid-cols-4'>
              {sellListings.map((listing) => (
                <li>
                  <ListingItem 
                  listing = {listing.data}
                  id = {listing.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
