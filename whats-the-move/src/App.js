// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Import Routes and Route from react-router-dom
import HomePage from './pages/HomePage';  // Import your pages
import FriendsPage from './pages/FriendsPage';
import Midpoint from './pages/Midpoint'

function App() {
  return (
    <div>
      <nav>
      </nav>

      <Routes>
        {/* Define Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/midpoint" element={<Midpoint />} />
      </Routes>
    </div>
  );
}

export default App;
