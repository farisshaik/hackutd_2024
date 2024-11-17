// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Import App component
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />  {/* No Router here, as it's already in App */}
  </React.StrictMode>
);