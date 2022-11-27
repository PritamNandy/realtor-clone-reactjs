// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYOB7hKMAKRBTMoGeLJ6uBXcfU-PdlPqw",
    authDomain: "realtor-clone-hdpritam.firebaseapp.com",
    projectId: "realtor-clone-hdpritam",
    storageBucket: "realtor-clone-hdpritam.appspot.com",
    messagingSenderId: "747552164167",
    appId: "1:747552164167:web:9f11cd6cd1f5dcc4a5e462",
    measurementId: "G-HYX1VYGWLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();