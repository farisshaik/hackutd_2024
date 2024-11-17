const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle POST requests with an API key
app.post('/api/data', (req, res) => {
  const apiKey = req.headers['authorization']; // Expecting the API key in the Authorization header

  // Check if the API key is correct (replace 'your_api_key' with the actual key)
  if (apiKey === 'Bearer your_api_key') {
    res.json({
      message: 'API key is valid',
      data: req.body,
    });
  } else {
    res.status(403).json({ error: 'Invalid API key' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


