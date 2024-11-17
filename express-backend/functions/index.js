const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Haversine formula to calculate distance between two points
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Calculate the geographic midpoint between two points
const calculateMidpoint = (lat1, lng1, lat2, lng2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const toDegrees = (radians) => (radians * 180) / Math.PI;

  // Convert latitudes and longitudes from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lng1Rad = toRadians(lng1);
  const lat2Rad = toRadians(lat2);
  const lng2Rad = toRadians(lng2);

  // Compute the midpoint
  const dLng = lng2Rad - lng1Rad;

  const Bx = Math.cos(lat2Rad) * Math.cos(dLng);
  const By = Math.cos(lat2Rad) * Math.sin(dLng);

  const lat3Rad = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2)
  );
  const lng3Rad = lng1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

  // Convert back to degrees
  const lat3 = toDegrees(lat3Rad);
  const lng3 = toDegrees(lng3Rad);

  return { lat: lat3, lng: lng3 };
};

// Function to find the fair midpoint
const findFairMidpoint = (coordinates) => {
  let maxDistance = 0;
  let point1 = null;
  let point2 = null;

  // Find the pair of participants who are furthest apart
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const lat1 = coordinates[i][0];
      const lng1 = coordinates[i][1];
      const lat2 = coordinates[j][0];
      const lng2 = coordinates[j][1];

      const distance = haversineDistance(lat1, lng1, lat2, lng2);

      if (distance > maxDistance) {
        maxDistance = distance;
        point1 = coordinates[i];
        point2 = coordinates[j];
      }
    }
  }

  // Compute the midpoint between the two furthest participants
  const midpoint = calculateMidpoint(
    point1[0],
    point1[1],
    point2[0],
    point2[1]
  );

  return midpoint;
};

// Sample greeting route
app.get("/greeting", (req, res) => {
  res.json({ message: "Hello huzz!" });
});

// API endpoint for fair midpoint calculation
app.post("/calculate-midpoint", (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res
        .status(400)
        .json({ error: "Provide at least two coordinate pairs." });
    }

    const midpoint = findFairMidpoint(coordinates);

    res.json({ midpoint });
  } catch (error) {
    console.error("Error calculating midpoint:", error.message);
    res
      .status(500)
      .json({ error: "Failed to calculate fair midpoint." });
  }
});

// Export the API as a Firebase Function
exports.api = functions.region("us-central1").https.onRequest(app);
