/**
 * @file firebase.js
 * @version 1.0.0
 * @description Firebase configuration and initialization for EngagePerfect AI
 * 
 * This file initializes Firebase services including Authentication, Firestore,
 * and Storage. It exports the initialized services for use throughout the application.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAboJ3IB1MM3GkOBwC1RTjzgvAGo2ablTo",
  authDomain: "engperfecthlc.firebaseapp.com",
  projectId: "engperfecthlc",
  storageBucket: "engperfecthlc.firebasestorage.app",
  messagingSenderId: "503333252583",
  appId: "1:503333252583:web:633b5ce3ba3619df572142",
  measurementId: "G-W98PHG26B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };