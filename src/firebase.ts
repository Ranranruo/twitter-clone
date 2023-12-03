// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3_00meyEOuBlEOyo3tvLgzY_8iTtnUhs",
  authDomain: "sdhs-twitter-clone.firebaseapp.com",
  projectId: "sdhs-twitter-clone",
  storageBucket: "sdhs-twitter-clone.appspot.com",
  messagingSenderId: "930070456767",
  appId: "1:930070456767:web:63acb67a7c1e257747990a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);