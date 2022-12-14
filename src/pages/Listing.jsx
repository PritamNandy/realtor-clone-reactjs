import { doc, getDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase';
import Spinner from '../components/Spinner';

export default function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const params = useParams();
  useEffect(() => {
    setLoading(true)
    async function fetchListing() {
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
            setListing(docSnap.data())
            console.log(docSnap.data())
        }
        setLoading(true)
    }
    fetchListing()
  }, [loading, params.listingId])

  if(loading) {
    return (
      <Spinner />
    )
  } else {
    return (
      <div>Listing</div>
    )
  }
}
