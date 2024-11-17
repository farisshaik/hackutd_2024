import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FriendsScreen from './screens/FriendsScreen';
import HomeScreen from './screens/HomeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import { IoHomeOutline, IoPeopleOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';

const TabNavigator = () => (
  <nav>
    <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
      <li>
        <Link to="/" style={{ textDecoration: 'none', color: 'gray' }}>
          <IoHomeOutline size={24} />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link to="/friends" style={{ textDecoration: 'none', color: 'gray' }}>
          <IoPeopleOutline size={24} />
          <span>Friends</span>
        </Link>
      </li>
      <li>
        <Link to="/favorites" style={{ textDecoration: 'none', color: 'gray' }}>
          <IoHeartOutline size={24} />
          <span>Favorites</span>
        </Link>
      </li>
      <li>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'gray' }}>
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
          <Route path="/" element={<HomeScreen />} />
          <Route path="/friends" element={<FriendsScreen />} />
          <Route path="/favorites" element={<FavoritesScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
