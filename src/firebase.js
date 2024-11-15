// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgGMejSjqS13o8yoQoDxECL-Q1nolE_KU",
  authDomain: "wipoproject2024.firebaseapp.com",
  projectId: "wipoproject2024",
  storageBucket: "wipoproject2024.firebasestorage.app",
  messagingSenderId: "1066791939736",
  appId: "1:1066791939736:web:84b8e9c4dba28747886aed",
  measurementId: "G-DWHJCW72DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };