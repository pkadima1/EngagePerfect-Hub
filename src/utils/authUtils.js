/**
 * @file authUtils.js
 * @version 1.0.0
 * @description Authentication utility functions for EngagePerfect AI
 * 
 * This file contains helper functions for user authentication including 
 * sign up, login, logout, password reset and Google authentication.
 * It interacts with Firebase auth service and Firestore database to manage user data.
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise} - Promise with user credentials
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Initialize user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: new Date(),
      plan_type: 'free',
      requests_limit: 100,
      requests_used: 0
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user credentials
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in with Google
 * @returns {Promise} - Promise with user credentials
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if this is a new user
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Initialize user document in Firestore for new Google sign-in
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        plan_type: 'free',
        requests_limit: 100,
        requests_used: 0
      });
    }
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Promise indicating sign out completion
 */
export const logOut = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password
 * @param {string} email - User email
 * @returns {Promise} - Promise indicating password reset email sent
 */
export const resetPassword = async (email) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

/**
 * Get current authenticated user's data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise} - Promise with user data
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw error;
  }
};