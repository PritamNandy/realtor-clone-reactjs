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
import { FaShare } from "react-icons/fa"

export default function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
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
      <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer
      h-12 w-12 border-2 border-gray-400 rounded-full flex justify-center items-center'
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => setShareLinkCopied(false), 2000)
      }}>
          <FaShare 
          className="text-lg text-slate-500"/>
      </div>
      { shareLinkCopied && (
        <p className='fixed top-[20%] right-[3%] font-semibold z-10 border-2 border-gray-200
        bg-white transition ease-in-out duration-150 rounded px-2'>Link Copied</p>
      )}
    </main>
  )
}
