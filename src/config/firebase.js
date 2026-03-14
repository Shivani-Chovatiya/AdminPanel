// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9TDXrpZYpxgvp7YKPqsGx8aYemX93o_o",
  authDomain: "steer-u.firebaseapp.com",
  projectId: "steer-u",
  storageBucket: "steer-u.firebasestorage.app",
  messagingSenderId: "382585440289",
  appId: "1:382585440289:web:b636d92fdf31f185453b60",
  measurementId: "G-XJK97Y4P0Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
