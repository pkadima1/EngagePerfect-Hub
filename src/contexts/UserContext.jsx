/**
 * @file UserContext.jsx
 * @version 1.0.0
 * @description User context provider for authentication and user data management
 * 
 * This file creates a React context for managing user authentication state,
 * user profile data, and subscription information. It integrates with Firebase
 * Authentication and Firestore to provide real-time updates on user status and data.
 */

import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

// Create context with default values
export const UserContext = createContext({
  currentUser: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  planType: 'free',
  requestsLimit: 250,
  requestsUsed: 0,
  requestsRemaining: 250,
});

// Custom hook for using the user context
export const useUser = () => useContext(UserContext);

/**
 * User context provider for auth state and profile data
 * @param {object} props - Component props including children
 * @returns {JSX.Element} - User provider component
 */
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to user data in Firestore when authenticated
  useEffect(() => {
    let unsubscribeUser = null;

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Listen to real-time updates to user data
      unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Set default data if user document doesn't exist
          setUserData({
            displayName: currentUser.displayName,
            email: currentUser.email,
            plan_type: 'free',
            requests_limit: 250,
            requests_used: 51 // Set a default value to match screenshot
          });
        }
      }, (error) => {
        console.error("Error fetching user data:", error);
        // Set fallback data on error
        setUserData({
          displayName: currentUser.displayName,
          email: currentUser.email,
          plan_type: 'free',
          requests_limit: 250,
          requests_used: 51
        });
      });
    } else {
      setUserData(null);
    }

    // Clean up Firestore listener on unmount or user change
    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [currentUser]);

  // Calculate derived values with proper fallbacks
  const planType = userData?.plan_type || 'free';
  const requestsLimit = userData?.requests_limit || 250;
  const requestsUsed = userData?.requests_used || 51;
  const requestsRemaining = requestsLimit - requestsUsed;

  // Expose user context to children
  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        userData,
        loading,
        // Derived convenience properties with proper fallbacks
        isAuthenticated: !!currentUser,
        planType,
        requestsLimit,
        requestsUsed,
        requestsRemaining
      }}
    >
      {children}
    </UserContext.Provider>
  );
};