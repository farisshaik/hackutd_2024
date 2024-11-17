// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router for routing
import App from './App';  // Import App component
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>  {/* Wrap your App component with Router */}
      <App />
    </Router>
  </React.StrictMode>
);