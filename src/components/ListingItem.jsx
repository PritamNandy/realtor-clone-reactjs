import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing, id }) {
  return (
    <li 
    className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md
    overflow-hidden transition-shadow duration-150 ease-in-out m-[10px]'>
      <Link className='contents' to={`category/${listing.type}/${id}`}>
        <img
        className='h-[170px] w-full object-cover hover:scale-105  transition-scale ease-in-out duration-200'
        loading='lazy'
         src={listing.imgUrls[0]} alt="Listing Image" />
        <Moment
        className='absolute top-2 left-2 font-semibold text-sm rounded-md bg-blue-600 
        text-white px-2 py-1 shadow-md'
        fromNow>{listing.timestamp?.toDate()}</Moment>
        <div className='w-full p-[10px]'>
          <div className='flex items-center space-x-1'>
            <MdLocationOn 
            className='h-4 w-4 text-green-600'/>
            <p
            className='font-semibold text-sm text-gray-600 truncate'>{listing.address}</p>
          </div>
        </div>
        <p className='font-semibold m-0 text-xl truncate'>
          {listing.name}
        </p>
        <p className='font-semibold mt-2 text-blue-500'>
          ${listing.offer ? 
          listing.discounted_price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
          listing.regular_price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
          { listing.type === 'rent' && ' / month'}
        </p>
        <div className='flex items-center mt-[10px] space-x-3 mb-3'>
          <div className='flex item-center space-x-1'>
            <p className='font-bold text-xs'>
              {listing.beds > 1 ? `${listing.beds} Beds` : `${listing.beds} Bed` }
            </p>
          </div>
          <div className='flex item-center space-x-1'>
            <p className='font-bold text-xs'>
              {listing.bath > 1 ? `${listing.bath} Baths` : `${listing.bath} Bath` }
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}
