// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDteoTkZP5lrxfI7jcuBFMCTbN79ZQ9SNI",
  authDomain: "inventory-management-a970a.firebaseapp.com",
  projectId: "inventory-management-a970a",
  storageBucket: "inventory-management-a970a.appspot.com",
  messagingSenderId: "220812142423",
  appId: "1:220812142423:web:1a25cef70215f496688012",
  measurementId: "G-B2890N6R66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore}