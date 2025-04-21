/**
 * @file AuthProvider.jsx
 * @version 1.0.0
 * @description Authentication provider component for EngagePerfect AI
 * 
 * This component uses the UserProvider from the UserContext to provide
 * authentication state management throughout the application.
 * It serves as a wrapper for the app that needs access to authentication data.
 */

import { UserProvider } from '../contexts/UserContext';

/**
 * Authentication provider component
 * @param {object} props - Component props including children
 * @returns {JSX.Element} - Auth provider component wrapper
 */
const AuthProvider = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

export default AuthProvider;