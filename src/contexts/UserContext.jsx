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
          setUserData(null);
        }
      });
    } else {
      setUserData(null);
    }

    // Clean up Firestore listener on unmount or user change
    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [currentUser]);

  // Expose user context to children
  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        userData,
        loading,
        // Derived convenience properties
        isAuthenticated: !!currentUser,
        planType: userData?.plan_type || 'free',
        requestsLimit: userData?.requests_limit || 0,
        requestsUsed: userData?.requests_used || 0,
        requestsRemaining: (userData?.requests_limit || 0) - (userData?.requests_used || 0)
      }}
    >
      {children}
    </UserContext.Provider>
  );
};