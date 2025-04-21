/**
 * @file ThemeContext.jsx
 * @version 1.0.0
 * @description Theme context provider for dark/light mode functionality
 * 
 * This file creates a React context for theme management, providing
 * functionality to toggle between dark and light modes and persisting
 * the user's preference in local storage.
 */

import { createContext, useState, useEffect, useContext } from 'react';

// Create context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme context provider component for managing dark/light mode
 * @param {object} props - Component props including children
 * @returns {JSX.Element} - Theme provider component
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if theme was stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // If not in localStorage, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    // Update class on document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference in localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};