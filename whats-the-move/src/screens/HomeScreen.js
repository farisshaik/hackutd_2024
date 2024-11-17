import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import config, { makeApiCall } from '../config/api';

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Validate API key is present
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is not configured in environment variables');
}

const HomeScreen = () => {
  // Default center coordinates (Richardson, TX - Campbell Road)
  const defaultCenter = {
    lat: 32.9856,
    lng: -96.7501
  };
  
  const fetchData = async () => {
    try {
      const data = await makeApiCall('/endpoint');
      // Handle response
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
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
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px',
  },
  mapContainer: {
    flex: 1,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  map: {
    width: '100%',
    height: '100%',
  }
};

export default HomeScreen;