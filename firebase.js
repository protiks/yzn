// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9Jb0c-nlCCOCVJqcDreXXZMt77aXCYK4",
  authDomain: "chtbt-7a420.firebaseapp.com",
  projectId: "chtbt-7a420",
  storageBucket: "chtbt-7a420.appspot.com",
  messagingSenderId: "590437232493",
  appId: "1:590437232493:web:57d171f47abf3d31e37464",
  measurementId: "G-09E90XD6E5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);