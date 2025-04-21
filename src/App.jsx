/**
 * @file App.jsx
 * @version 1.0.0
 * @description Main application component with routing setup
 * 
 * This file sets up the application's routing configuration using React Router,
 * defines protected routes, and implements the theme and authentication providers.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthProvider from './components/AuthProvider';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import { useUser } from './contexts/UserContext';

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  
  if (loading) return null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect home to dashboard or login */}
            <Route 
              path="/" 
              element={
                <Navigate to="/dashboard" />
              } 
            />
            
            {/* Redirect all other routes to dashboard */}
            <Route 
              path="*" 
              element={
                <Navigate to="/dashboard" />
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
