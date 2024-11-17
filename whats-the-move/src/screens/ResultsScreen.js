import React, { useState } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Validate API key is present
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error("Google Maps API key is not configured in environment variables");
}

const ResultsScreen = () => {
  const [userPoints, setUserPoints] = useState([
    { lat: 32.7767, lng: -96.7970 }, // Dallas
    { lat: 33.1507, lng: -96.8236 }, // Frisco
    { lat: 33.0198, lng: -96.6989 }, // Plano
  ]);
  const [midpoint, setMidpoint] = useState({ lat: 32.98, lng: -96.75 }); // Mock midpoint
  const [places, setPlaces] = useState([
    {
      place_id: "1",
      name: "Mock Restaurant 1",
      address: "123 Main St",
      rating: 4.5,
      location: { lat: 32.982, lng: -96.751 },
    },
    {
      place_id: "2",
      name: "Mock Cafe",
      address: "456 Elm St",
      rating: 4.2,
      location: { lat: 32.981, lng: -96.752 },
    },
    {
      place_id: "3",
      name: "Mock Gym",
      address: "789 Oak St",
      rating: 4.8,
      location: { lat: 32.983, lng: -96.753 },
    },
  ]); // Mock POIs
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div style={styles.container}>
      {/* Map Section */}
      <div style={styles.mapContainer}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={midpoint}
            defaultZoom={12}
            gestureHandling="greedy"
            style={styles.map}
          >
            {/* User Points */}
            {userPoints.map((point, index) => (
              <Marker
                key={`user-point-${index}`}
                position={point}
                label={`U${index + 1}`}
              />
            ))}

            {/* Midpoint */}
            <Marker
              position={midpoint}
              label="Mid"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />

            {/* Points of Interest */}
            {places.map((place) => (
              <Marker
                key={place.place_id}
                position={place.location}
                label="POI"
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {/* InfoWindow for Selected Place */}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.location}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h4>{selectedPlace.name}</h4>
                  <p>{selectedPlace.address}</p>
                  <p>Rating: {selectedPlace.rating || "N/A"}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Cards Section */}
        <div style={styles.cardsContainer}>
        {places.map((place) => (
            <div key={place.place_id} style={styles.card}>
            <img
                src="https://via.placeholder.com/150" // Replace with actual image URL
                alt={place.name}
                style={styles.cardImage}
            />
            <div style={styles.cardContent}>
                <h4 style={styles.cardTitle}>{place.name}</h4>
                <p style={styles.cardAddress}>{place.address}</p>
                <p style={styles.cardRating}>Rating: {place.rating || "N/A"}</p>
                <button
                style={styles.button}
                onClick={() => setSelectedPlace(place)}
                >
                View on Map
                </button>
            </div>
        </div>
        ))}
        </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  },
  mapContainer: {
    width: "100%",
    height: "60%", // Map occupies 3/5 of the screen height
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "row", // Cards in a horizontal row
    overflowX: "scroll", // Enable horizontal scrolling
    gap: "10px", // Space between cards
    padding: "10px",
    height: "35%", // Cards occupy 2/5 of the screen height
    backgroundColor: "#fff",
    boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)", // Shadow above the card row
  },
  card: {
    flex: "0 0 300px", // Fixed card width
    height: "90%", // Make cards square-ish
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ResultsScreen;