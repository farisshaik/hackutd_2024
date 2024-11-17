const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Haversine formula to calculate distance between two points
const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180; // Correct indentation
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

// Calculate weighted geographic midpoint
const calculateWeightedMidpoint = (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
        throw new Error("Coordinates array is empty.");
    }

    // Step 1: Calculate initial simple midpoint
    const simpleLat = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const simpleLng = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;

    // Step 2: Calculate weights based on distance from simple midpoint
    const weights = coordinates.map(([lat, lng]) => {
        const distance = haversineDistance(lat, lng, simpleLat, simpleLng);
        return 1 / (distance + 0.0001); // Avoid division by zero
    });

    // Step 3: Calculate weighted averages
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const weightedLat = coordinates.reduce((sum, coord, i) => sum + weights[i] * coord[0], 0) / totalWeight;
    const weightedLng = coordinates.reduce((sum, coord, i) => sum + weights[i] * coord[1], 0) / totalWeight;

    return {
        lat: weightedLat,
        lng: weightedLng,
    };
};

// Sample greeting route
app.get("/greeting", (req, res) => {
    res.json({ message: "Hello huzz!" });
});

// API endpoint for weighted midpoint calculation
app.post("/calculate-midpoint", (req, res) => {
    try {
        const { coordinates } = req.body;

        if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return res.status(400).json({ error: "Provide at least two coordinate pairs." });
    }

    const midpoint = calculateWeightedMidpoint(coordinates);

    res.json({ midpoint });
  } catch (error) {
        console.error("Error calculating weighted midpoint:", error.message);
        res.status(500).json({ error: "Failed to calculate weighted midpoint." });
  }
});

// Export the API as a Firebase Function
exports.api = functions.region("us-central1").https.onRequest(app);