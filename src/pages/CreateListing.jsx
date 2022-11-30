import React, { useState } from 'react'

export default function CreateListing() {
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        beds: 1,
        bath: 1,
        parking: false,
        furnished: false,
        address: '',
        description: '',
        offer: false,
        regular_price: 0,
        discounted_price: 0
    })
    const {type, name, beds, bath, parking, furnished, address, description, offer, regular_price, discounted_price} = formData
    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1
        className='text-3xl text-center mt-6 font-bold uppercase'>
            Create a Listing</h1>
            <form>
                <p
                className='text-lg mt-6 font-semibold'>Sell / Rent</p>
                <div className='flex items-center mt-2'>
                    <button
                    type='button'
                    id='type'
                    value="sale"
                    onClick={onChange}
                    className={`uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        type === 'rent' ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >Sell</button>

                    <button
                    type='button'
                    id='type'
                    value="rent"
                    onClick={onChange}
                    className={`ml-3 uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        type === 'sale' ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >Rent</button>
                </div>

                <p
                className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id='name' value={name}
                placeholder="Property Name"
                onChange={onChange}
                minLength="10"
                maxLength="32"
                required
                className='mt-2 w-full rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition ease-in-out duration-150 px-4 py-2 text-gray-700 border border-gray-300
                focus:bg-white active:bg-white' />

                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p
                        className='text-lg mt-6 font-semibold'>Beds</p>
                        <input type="number"
                        id='beds'
                        value={beds}
                        placeholder="1"
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                        transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                        focus:shadow-lg active:shadow-lg" />
                    </div>
                    <div>
                        <p
                        className='text-lg mt-6 font-semibold'>Bath</p>
                        <input type="number"
                        id='bath'
                        value={bath}
                        placeholder="1"
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                        transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                        focus:shadow-lg active:shadow-lg" />
                    </div>
                </div>

                <p
                className='text-lg mt-6 font-semibold'>Parking</p>
                <div className='flex items-center mt-2'>
                    <button
                    type='button'
                    id='parking'
                    value={true}
                    onClick={onChange}
                    className={`uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >Yes</button>

                    <button
                    type='button'
                    id='parking'
                    value={false}
                    onClick={onChange}
                    className={`ml-3 uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        parking ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >No</button>
                </div>

                <p
                className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className='flex items-center mt-2'>
                    <button
                    type='button'
                    id='furnished'
                    value={true}
                    onClick={onChange}
                    className={`uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >Yes</button>

                    <button
                    type='button'
                    id='furnished'
                    value={false}
                    onClick={onChange}
                    className={`ml-3 uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >No</button>
                </div>

                <p
                className='text-lg mt-6 font-semibold'>Address</p>
                <textarea type="text" id='address' value={address}
                placeholder="Property Address"
                onChange={onChange}
                minLength="10"
                maxLength="32"
                required
                className='mt-2 w-full rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition ease-in-out duration-150 px-4 py-2 text-gray-700 border border-gray-300
                focus:bg-white active:bg-white' />

                <p
                className='text-lg mt-6 font-semibold'>Description</p>
                <textarea type="text" id='description' value={description}
                placeholder="Property Description"
                onChange={onChange}
                minLength="10"
                maxLength="32"
                required
                className='mt-2 w-full rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg
                transition ease-in-out duration-150 px-4 py-2 text-gray-700 border border-gray-300
                focus:bg-white active:bg-white' />

                <p
                className='text-lg mt-6 font-semibold'>Offer</p>
                <div className='flex items-center mt-2'>
                    <button
                    type='button'
                    id='offer'
                    value={true}
                    onClick={onChange}
                    className={`uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >Yes</button>

                    <button
                    type='button'
                    id='offer'
                    value={false}
                    onClick={onChange}
                    className={`ml-3 uppercase bg-white px-7 py-2 font-medium text-sm shadow-md rounded
                    hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150
                    w-full ${
                        offer ? "bg-white text-black" : "bg-slate-600 text-white"
                    }`}
                    >No</button>
                </div>

                <p
                className='text-lg mt-6 font-semibold'>Regular Price</p>
                <div className='flex items-center mt-2'>
                <input type="number"
                        id='regular_price'
                        value={regular_price}
                        placeholder="1"
                        onChange={onChange}
                        min="10"
                        max="10000000"
                        required
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                        transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                        focus:shadow-lg active:shadow-lg mr-2" />
                    { type === 'rent' && (
                        <span className='w-full text-sm font-semibold text-grey-600'>$ / month</span>
                    )}
                </div>

                { offer && (
                    <div>
                        <p
                    className='text-lg mt-6 font-semibold'>Discounted Price</p>
                    <div className='flex items-center mt-2'>
                    <input type="number"
                            id='discounted_price'
                            value={discounted_price}
                            placeholder="1"
                            onChange={onChange}
                            min="10"
                            max="10000000"
                            required={offer}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                            transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                            focus:shadow-lg active:shadow-lg mr-2" />
                        { type === 'rent' && (
                            <span className='w-full text-sm font-semibold text-grey-600'>$ / month</span>
                        )}
                    </div>
                    </div>
                )}
                <div>
                    <p
                    className='text-lg mt-6 font-semibold'>Images</p>
                    <p className='text-xs font-semibold text-red-600'>The first image is the cover (max 6 images)</p>
                    <input type="file"
                    id='images'
                    onChange={onChange}
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                    className='mt-2 w-full bg-white border border-grey-300 py-2 px-2 rounded shadow-sm' />
                </div>
                <button
                type='submit'
                className='my-6 w-full px-2 bg-blue-600 text-white uppercase py-4 rounded font-semibold
                shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg
                transition duration-150 ease-in-out'>
                    Create listing
                </button>
            </form>
    </main>
  )
}
