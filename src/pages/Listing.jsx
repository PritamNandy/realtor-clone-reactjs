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
import { FaShare, FaSearchLocation, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa"
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, TileLayer, LocationMarker, Marker, Popup } from 'react-leaflet'

export default function Listing() {
  const auth = getAuth();
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [contactLandLord, setContactLandLord] = useState(false)
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

      <div
      className='flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg border-3 bg-white shadow-lg'>
        <div className='w-full pr-4'>
          <p className='font-bold text-2xl text-blue-900 '>
            {listing.name} - ${listing.offer ? 
          listing.discounted_price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
          listing.regular_price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
          { listing.type === 'rent' && ' / month'}
          </p>
          <p
          className='flex items-center mt-5 mb-3 font-semibold'>
            <FaSearchLocation 
            className='text-green-700 mr-1'/>
            {listing.address}
          </p>
          <div 
          className='flex justify-start items-center space-x-4 w-[75%]'>
            <p
            className='bg-red-800 text-white w-full max-w-[200px] text-center
            font-semibold rounded py-1 shadow-md'>
              {listing.type === 'rent' ? "Rent" : "Sale"}
            </p>
              {listing.offer &&  (
                <p
                className='bg-green-800 text-white w-full max-w-[200px] text-center
            font-semibold rounded py-1 shadow-md'>
                  ${+listing.regular_price - +listing.discounted_price} discount
                </p>
              )}
          </div>
          <p className='mt-3 mb-3'>
            <span
            className='font-semibold'>Description - </span>
            {listing.description}
          </p>
          <ul
          className='flex space-x-3 lg:space-x-10 text-sm font-semibold items-center mb-6'>
            <li
            className='flex items-center whitespace-nowrap'>
              <FaBed 
              className='text-lg mr-1'/>
              {+listing.beds > 1 ? `${listing.beds} Beds` : `${listing.beds} Bed`}
            </li>
            <li
            className='flex items-center whitespace-nowrap'>
              <FaBath 
              className='text-lg mr-1'/>
              {+listing.bath > 1 ? `${listing.bath} Baths` : `${listing.bath} Bath`}
            </li>
            <li
            className='flex items-center whitespace-nowrap'>
              <FaParking 
              className='text-lg mr-1'/>
              {listing.parking === true ? 'Parking' : 'No Parking'}
            </li>
            <li
            className='flex items-center whitespace-nowrap'>
              <FaChair 
              className='text-lg mr-1'/>
              {listing.furnished === true ? 'Furnished' : 'No Furnished'}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser.uid && !contactLandLord && (
            <div className='mt-4'>
              <button
              onClick={()=>(
                setContactLandLord(true)
              )}
            className='bg-blue-700 text-white px-7 py-3 rounded font-medium w-full shadow-md hover:bg-blue-900
            hover:shadow-lg focus:bg-blue-900 focus:shadow-xl text-center transition duration-150 ease-in-out'>
              Contact Landlord
            </button>
            </div>
          )}
          {contactLandLord && (
              <Contact 
                userRef={listing.userRef}
                listing = {listing}
              />
          )}
        </div>
        <div className='w-full h-[200px] md:h-[400px] sm:mt-6 lg:mt-0'>
        <MapContainer
          center={{ lat: listing.geoLocation.lat, lng: listing.geoLocation.lng }}
          zoom={13}
          scrollWheelZoom={false}
          style={{height: "100%", width: "100%"}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={{ lat: listing.geoLocation.lat, lng: listing.geoLocation.lng }}>
            <Popup>
              {listing.address}
            </Popup>
          </Marker>
        </MapContainer>
        </div>
      </div>
    </main>
  )
}
