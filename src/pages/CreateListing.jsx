import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Navigate, useNavigate } from 'react-router';

export default function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
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
        discounted_price: 0,
        lat: 0,
        lng: 0,
        images: {}
    })
    const {type, name, beds, bath, parking, furnished, address,
         description, offer, regular_price, discounted_price, lat, lng, images} = formData
    function onChange(e) {
        let boolean = null;
        if(e.target.value === "true") {
            boolean = true;
        } else if(e.target.value === 'false') {
            boolean = false;
        }
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        } 
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true)
        if(+discounted_price >= +regular_price) {
            setLoading(false)
            toast.error('Discount price should be less than regular price')
        }
        if(images.length > 6) {
            setLoading(false)
            toast.error('Maximum 6 images are allowed')
            console.log(images.length)
        }
        let geoLocation = {}
        let location 
        if (geoLocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY}`)
            const data = await response.json()
            console.log(data.status)
            geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geoLocation.lng = data.results[0]?.geometry.location.lat ?? 0;

            location = data.status === 'ZERO_RESULTS' && undefined;
            if(location === undefined) {
                setLoading(false)
                toast.error('Enter a correct address')
            }
        } else {
            geoLocation.lat = lat;
            geoLocation.lng = lng;
        }

        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        }
                    }, 
                    (error) => {
                        reject(error)
                    }, 
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))).catch((error) => {
                console.log(error)
                setLoading(false)
                toast.error("Images not uploaded")
                return;
            }
        );

        const formDataCopy = {
            ...formData,
            imgUrls,
            geoLocation,
            timestamp:serverTimestamp()
        }
        console.log(imgUrls)
        delete formDataCopy.images;
        delete formDataCopy.lat;
        delete formDataCopy.lng;
        !formDataCopy.offer && delete formDataCopy.discounted_price;
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false)
        toast.success('Listing Created!')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    if(loading) {
        return <Spinner/>
    } else {
        return (
            <main className='max-w-md px-2 mx-auto'>
                <h1
                className='text-3xl text-center mt-6 font-bold uppercase'>
                    Create a Listing</h1>
                    <form
                        onSubmit={onSubmit}>
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
                                className="mt-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
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
                                className="mt-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
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
        
                        { geoLocationEnabled && (
                            <div className='flex space-x-6 mb-6'>
                                <div>
                                    <p
                                    className='text-lg mt-6 font-semibold'>Latitude</p>
                                    <input type="number"
                                    id='lat'
                                    value={lat}
                                    placeholder="1"
                                    onChange={onChange}
                                    required={geoLocationEnabled}
                                    className="mt-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                                    transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                                    focus:shadow-lg active:shadow-lg" />
                                </div>
                                <div>
                                    <p
                                    className='text-lg mt-6 font-semibold'>Longitude</p>
                                    <input type="number"
                                    id='lng'
                                    value={lng}
                                    onChange={onChange}
                                    required={geoLocationEnabled}
                                    className="mt-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded
                                    transition ease-in-out duration-150 shadow-md focus:bg-white active:bg-white
                                    focus:shadow-lg active:shadow-lg" />
                                </div>
                            </div>
                        )}
                        
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
  
}
