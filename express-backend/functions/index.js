const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sample endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Firebase Functions!' });
});

// Export the app as a Firebase Function
exports.api = functions.region('us-central1').https.onRequest(app);
