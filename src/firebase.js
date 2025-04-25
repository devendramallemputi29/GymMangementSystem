// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAy0yrmPqY5EY_a7JtZAxetjY9o-7AUoC0",
  authDomain: "gym-management-system-70208.firebaseapp.com",
  projectId: "gym-management-system-70208",
  storageBucket: "gym-management-system-70208.appspot.com",
  messagingSenderId: "895917836763",
  appId: "1:895917836763:web:a6c9748e8919619c5bfffe",
  measurementId: "G-4P1VHE0K9E",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
