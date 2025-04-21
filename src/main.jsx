/**
 * @file main.jsx
 * @version 1.0.0
 * @description Application entry point
 * 
 * This file serves as the main entry point for the EngagePerfect AI application.
 * It renders the root App component to the DOM and includes global styles.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
