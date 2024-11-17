require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
const port = 5001;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle requests to the Google Maps API
app.get('/api/nearbyplaces', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Make sure this is set in your environment variables

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 1000,
          type: 'restaurant',
          key: apiKey,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Maps API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
