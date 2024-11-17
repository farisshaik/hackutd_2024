const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: "/tmp/" }); // Firebase provides a `/tmp` directory for temporary storage

// Initialize Google Cloud Secret Manager client
const client = new SecretManagerServiceClient();

let PINATA_JWT = null;
const PINATA_BASE_URL = "https://api.pinata.cloud"; // Pinata Base URL

// Function to fetch secrets from Secret Manager
async function getSecret(secretName) {
  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/hackutd24-whatsthemove/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString("utf8");
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    process.exit(1); // Exit if the secret cannot be retrieved
  }
}

// Initialize secrets and environment variables
(async () => {
  PINATA_JWT = await getSecret("PINATA_JWT");
  if (!PINATA_JWT) {
    console.error("PINATA_JWT is not set in Secret Manager.");
    process.exit(1);
  }
})();

// Helper function to send requests to Pinata
async function pinataRequest(endpoint, method = "GET", data = null, headers = {}) {
  const url = `${PINATA_BASE_URL}${endpoint}`;
  const fetch = (await import("node-fetch")).default;

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...headers,
    },
  };

  if (data) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata API request failed: ${error}`);
  }

  return response.json();
}

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

// Routes

app.get("/pinata-test", async (req, res) => {
  try {
    const result = await pinataRequest("/data/testAuthentication");
    res.status(200).json({ success: true, message: "Pinata is connected!", result });
  } catch (error) {
    console.error("Pinata connection failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to connect to Pinata", error: error.message });
  }
});

app.post("/upload", upload.array("media"), async (req, res) => {
  try {
    const { title, content } = req.body; // Blog post data
    const files = req.files; // Uploaded media files
    const mediaUrls = [];

    // Step 1: Handle media uploads
    if (files && files.length > 0) {
      for (const file of files) {
        const data = new FormData();
        data.append("file", fs.createReadStream(file.path));

        const metadata = JSON.stringify({
          name: file.originalname,
          keyvalues: { type: "blog_media" },
        });
        data.append("pinataMetadata", metadata);

        // Pin file to IPFS
        const response = await pinataRequest("/pinning/pinFileToIPFS", "POST", data, {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        });

        // Collect the URL for each uploaded file
        mediaUrls.push(`https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`);
        fs.unlinkSync(file.path); // Clean up temporary files
      }
    }

    // Step 2: Create the JSON object to store
    const blogPost = {
      title,
      content,
      media: mediaUrls, // Array of URLs for uploaded media
    };

    // Step 3: Pin JSON object to IPFS
    const response = await pinataRequest("/pinning/pinJSONToIPFS", "POST", blogPost, {
      "Content-Type": "application/json",
    });

    res.status(200).json({
      success: true,
      cid: response.IpfsHash, // CID of the pinned JSON object
      mediaUrls, // Media URLs in case they need to be displayed immediately
    });
  } catch (error) {
    console.error("Error uploading blog post:", error.message);
    res.status(500).json({ error: `Failed to upload blog post: ${error.message}` });
  }
});

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
    res.status(500).json({ error: "Failed to calculate fair midpoint." });
  }
});

app.get("/blogs", async (req, res) => {
    try {
      // Fetch all pinned items from Pinata
      const result = await pinataRequest("/data/pinList", "GET");
  
      // Process each item to extract blog post details
      const posts = await Promise.all(
        result.rows.map(async (row) => {
          try {
            // Fetch the pinned JSON object using the IPFS hash
            const fetch = (await import("node-fetch")).default;
            const response = await fetch(
              `https://gateway.pinata.cloud/ipfs/${row.ipfs_pin_hash}`
            );
  
            if (!response.ok) {
              throw new Error(`Failed to fetch JSON for IPFS hash: ${row.ipfs_pin_hash}`);
            }
  
            const json = await response.json();
  
            return {
              id: row.ipfs_pin_hash,
              title: json.title || "Untitled",
              content: json.content || "No content available.",
              media: json.media || [], // Media URLs as stored in the JSON
            };
          } catch (err) {
            console.error("Error fetching JSON for row:", err.message);
            return null; // Skip this row if there's an error
          }
        })
      );
  
      // Filter out any null results from failed fetches
      const validPosts = posts.filter((post) => post !== null);
  
      res.status(200).json({ posts: validPosts });
    } catch (error) {
      console.error("Error fetching blog posts:", error.message);
      res.status(500).json({ error: "Failed to fetch blog posts." });
    }
  });

app.get("/greeting", (req, res) => {
  res.json({ message: "Hello huzz!" });
});

app.get("/check-env", (req, res) => {
  res.json({ jwt: PINATA_JWT ? "Loaded" : "Not Initialized" });
});

// Export the API as a Firebase Function
exports.api = functions.region("us-central1").https.onRequest(app);
