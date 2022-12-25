import { async } from '@firebase/util';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { db } from '../firebase';

export default function Offers() {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchListing] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(4))
        const docSnap = await getDocs(q)
        const lastVisible = docSnap.docs[docSnap.docs.length - 1]
        setLastFetchListing(lastVisible)
        const offerListings = [];
        docSnap.forEach((doc) => {
          return offerListings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setOfferListings(offerListings)
        console.log(offerListings)
        setLoading(false)
      } catch (error) {
        toast.error('Couldn\'t fetch listings')
      }
    }

    fetchListings();
  }, [])

  async function fetchMoreListing() {
    try {
      const listingRef = collection(db, 'listings')
      const q = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(4))
      const docSnap = await getDocs(q)
      const lastVisible = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchListing(lastVisible)
      const offerListings = [];
      docSnap.forEach((doc) => {
        return offerListings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setOfferListings((prevState) => [
        ...prevState, ...offerListings
      ])
      console.log(offerListings)
      setLoading(false)
    } catch (error) {
      toast.error('Couldn\'t fetch listings')
    }
  }
  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold uppercase'>Offers</h1>
      {loading ? (
          <Spinner/>
        ) : 
        offerListings && offerListings.length > 0 ? 
        (
          <>
          <main>
            <ul
            className='sm:grid md:grid-cols-2 lg:grid-cols-4 mt-5'
            >
              {offerListings.map((listing) => {
                return <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              })}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className='flex justify-center items-center '>
              <button className='bg-red-500 px-3 py-1.5 font-semibold text-white border-gray-300 shadow-md my-6 rounded
              transition duration-150 ease-in-out hover:shadow-lg'
              onClick={() => fetchMoreListing()}>Load More</button>
            </div>
          )}
          </>
        ) : 
        (
          <p>There are no offers available right now!</p>
        )
      }

    </div>
  )
}
