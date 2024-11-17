import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
<<<<<<< HEAD
import HomePage from './pages/HomePage'; // Import your pages
import FriendsPage from './pages/FriendsPage';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import BlogPage from './screens/BlogPage';
import { IoHomeOutline, IoPeopleOutline, IoHeartOutline, IoPersonOutline, IoMapOutline } from 'react-icons/io5';
import { ThemeProvider } from "@material-tailwind/react"; // Import ThemeProvider
import './App.css'; // Import your CSS file
=======
import HomePage from './pages/HomePage'; 
import FriendsPage from './pages/FriendsPage';
import ProfileScreen from './screens/ProfileScreen';
import ResultsScreen from './screens/ResultsScreen';
import Midpoint from './pages/Midpoint';
import POI from './pages/PlaceOfInterest';
import DirectionsPage from './pages/DirectionsPage';
import { IoHomeOutline, IoPeopleOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import './App.css';
>>>>>>> d9f7d803df4dc0a13bbfa2588d3ee6fed8622fb8

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
        <Link to="/blog" className="nav-link">
          <IoMapOutline size={24} />
          <span>Explore</span>
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
    <ThemeProvider>
      <Router>
        <div>
          <TabNavigator />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
