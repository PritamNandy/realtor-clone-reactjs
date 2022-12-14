import { doc, getDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import "swiper/css/bundle"
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";

export default function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  SwiperCore.use([Autoplay, Navigation, Pagination])
  const params = useParams();
  useEffect(() => {
    console.log(params.listingId)
    async function fetchListingDetails() {
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
            setListing(docSnap.data())
            console.log(docSnap.data())
            setLoading(false)
        }
    }
    fetchListingDetails()
  }, [params.listingId])

  if(loading) {
    return <Spinner />
  }

  return (
    <main>
      <Swiper 
        slidesPerView={1} 
        navigation 
        pagination={{type: 'progressbar'}} 
        effect="fade" 
        modules={[EffectFade]} 
        autoplay={{delay: 3000}}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
              <div 
              className='w-full h-[300px] overflow-hidden relative' 
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover"
              }}>

              </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  )
}
