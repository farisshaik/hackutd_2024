import React, { useState } from 'react';

export default function ProfileScreen() {
  const [isLocationShared, setIsLocationShared] = useState(false);

  const handleToggle = () => {
    setIsLocationShared(!isLocationShared);
  };

  const userData = {
    name: 'Khabib Nurmagomedov',
    email: 'khabib@nurmagomedov.com',
    bio: 'Like to smash',
    favoriteLocations: ['Dagestan', 'Central Park', 'Gold’s Gym'],
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {/* Placeholder Profile Picture */}
        <img
          src={require('../khabib.jpeg')}
          alt="Profile"
          style={styles.profilePicture}
        />
        <h1 style={styles.name}>{userData.name}</h1>
        <p style={styles.email}>{userData.email}</p>
        <p style={styles.bio}>{userData.bio}</p>

        <h2 style={styles.sectionHeader}>Favorite Locations</h2>
        <ul style={styles.locationList}>
          {userData.favoriteLocations.map((location, index) => (
            <li key={index} style={styles.locationItem}>{location}</li>
          ))}
        </ul>

        <button style={styles.editButton}>Edit Profile</button>

        {/* Toggle Button for Sharing Location */}
        <div style={styles.toggleContainer}>
          <label style={styles.toggleLabel}>
            Share Location with Friends: 
          </label>
          <button
            onClick={handleToggle}
            style={{
              ...styles.toggleButton,
              backgroundColor: isLocationShared ? '#28a745' : '#dc3545',
            }}
          >
            {isLocationShared ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  profilePicture: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  },
  name: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#00509e',
  },
  email: {
    fontSize: '16px',
    color: '#666',
    margin: '5px 0',
  },
  bio: {
    fontSize: '14px',
    color: '#333',
    margin: '10px 0',
  },
  sectionHeader: {
    fontSize: '20px',
    fontWeight: '600',
    marginTop: '20px',
    color: '#00509e',
  },
  locationList: {
    listStyleType: 'none',
    padding: 0,
    margin: '10px 0',
  },
  locationItem: {
    fontSize: '14px',
    color: '#555',
    margin: '5px 0',
  },
  editButton: {
    marginTop: '20px',
    padding: '10px 15px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#00509e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  toggleLabel: {
    display: 'block',
    fontSize: '16px',
    color: '#333',
    marginBottom: '10px',
  },
  toggleButton: {
    padding: '10px 20px',
    fontSize: '14px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};