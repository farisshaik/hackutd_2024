import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import FriendsPage from './pages/FriendsPage';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import Midpoint from './pages/Midpoint';
import POI from './pages/PlaceOfInterest';
import DirectionsPage from './pages/DirectionsPage';
import { IoHomeOutline, IoPeopleOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import './App.css';

const TabNavigator = () => (
  <nav className="navbar">
    <ul className="nav-list">
      <li>
        <Link to="/" className="nav-link">
          <IoHomeOutline size={24} />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link to="/friends" className="nav-link">
          <IoPeopleOutline size={24} />
          <span>Friends</span>
        </Link>
      </li>
      <li>
        <Link to="/results" className="nav-link">
          <IoHeartOutline size={24} />
          <span>Results</span>
        </Link>
      </li>
      <li>
        <Link to="/profile" className="nav-link">
          <IoPersonOutline size={24} />
          <span>Profile</span>
        </Link>
      </li>
    </ul>
  </nav>
);

const App = () => {
  return (
    <Router>
      <div>
        <TabNavigator />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/midpoint" element={<Midpoint />} />
            <Route path="/poi" element={<POI />} />
            <Route path="/directions" element={<DirectionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
