import React from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { useState } from 'react'
import { useEffect } from 'react'
import Spinner from '../components/Spinner'
import { db } from '../firebase'
import { Swiper, SwiperSlide } from 'swiper/react';
import { AutoPlay, Navigation, Pagination, Scrollbar, A11y, EffectFade } from 'swiper';
import 'swiper/css/bundle'
import { useNavigate } from 'react-router'

export default function Slider() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
      async function fetchListings() {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, orderBy("timestamp", 'desc'), limit(5))
        const docSnap = await getDocs(q)
        let listings = [];
        docSnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        console.log(listings)
        setListings(listings)
        setLoading(false)
      }
      fetchListings()
    }, [])

    if(loading) {
        return <Spinner />
    } 
    if(listings.length === 0) {
        return <></>
    }
    return (
        listings && (
            <>
                <Swiper
                    modules={[EffectFade, Navigation, Pagination]}
                    autoplay={{delay: 3000}}
                    navigation
                    pagination={{ type:"progressbar" }}
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {listings.map((listing, id) => (
                        <SwiperSlide key={id} onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}>
                            <div 
                            style={{background: `url(${listing.data.imgUrls[0]}) center no-repeat`, 
                            backgroundSize: 'cover'}}
                            className="w-full h-[300px] overflow-hidden">
                                <p
                                className='absolute left-1 top-3 font-medium text-white
                                bg-blue-700 shadow-lg opacity-90 p-2 rounded-br-lg rounded-tl-lg max-w-[90%]'>{listing.data.name}</p>

<p
                                className='absolute left-1 bottom-3 font-medium text-white
                                bg-red-400 shadow-lg opacity-90 p-2 px-4 rounded-tl-lg rounded-br-lg max-w-[90%]'>${listing.data.discounted_price ?? listing.data.regular_price} {listing.data.type === 'sale' ? '' : '/ month'}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    )
}
