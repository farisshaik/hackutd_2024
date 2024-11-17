import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Import your pages
import FriendsPage from './pages/FriendsPage';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import { IoHomeOutline, IoPeopleOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import './App.css'; // Import your CSS file

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App