import React, { useState } from 'react';
import axios from 'axios';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import config from '../config/api';

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Validate API key is present
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is not configured in environment variables');
}

const HomeScreen = () => {
  const [places, setPlaces] = useState([]);
  
  // Default center coordinates
  const defaultCenter = {
    lat: 32.9856,
    lng: -96.7501
  };

  // Define midpoint using defaultCenter for now
  const midpoint = defaultCenter;

  // Function to fetch nearby places
  const fetchNearbyPlaces = async () => {
    console.log('Calculate button clicked!');
    try {
      // Request to your server's API endpoint
      const response = await axios.get('http://localhost:5001/api/nearbyplaces', {
        params: {
          lat: midpoint.lat,
          lng: midpoint.lng,
        },
      });
      console.log('API Response:', response.data);
      setPlaces(response.data.results.results.slice(0, 5)); // Note the additional 'results' nesting
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };
  
  
  

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={15}
            gestureHandling={'greedy'}
            style={styles.map}
          >
            <Marker position={defaultCenter} />
          </Map>
        </APIProvider>
      </div>
      <button style={styles.calculateButton} onClick={fetchNearbyPlaces}>
        Calculate
      </button>
      <div style={styles.placesContainer}>
        {places.map((place, index) => (
          <div key={index} style={styles.placeItem}>
            <h3>{place.name}</h3>
            <p>{place.vicinity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px',
  },
  mapContainer: {
    flex: 1,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    height: '60vh',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calculateButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  placesContainer: {
    marginTop: '20px',
    maxHeight: '30vh',
    overflowY: 'auto',
    width: '100%',
    textAlign: 'left',
  },
  placeItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default HomeScreen;
