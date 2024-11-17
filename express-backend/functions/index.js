const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const PinataSDK = require("@pinata/sdk");
const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: "/tmp/" }); // Firebase provides a `/tmp` directory for temporary storage

// Initialize Google Cloud Secret Manager client
const client = new SecretManagerServiceClient();

let pinata = null;

// Function to fetch secrets from Secret Manager
async function getSecret(secretName) {
  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/hackutd24-whatsthemove/secrets/${secretName}/versions/latest`, // Replace YOUR_PROJECT_ID
    });
    return version.payload.data.toString("utf8");
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    process.exit(1); // Exit if the secret cannot be retrieved
  }
}

// Fetch Pinata JWT secret and initialize Pinata SDK
(async () => {
  const PINATA_JWT = await getSecret("PINATA_JWT");
  if (!PINATA_JWT) {
    console.error("PINATA_JWT is not set in Secret Manager.");
    process.exit(1);
  }

  pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: "magenta-past-ox-758.mypinata.cloud", // Optional, if using a custom gateway
  });
})();

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

  const lat1Rad = toRadians(lat1);
  const lng1Rad = toRadians(lng1);
  const lat2Rad = toRadians(lat2);
  const lng2Rad = toRadians(lng2);

  const dLng = lng2Rad - lng1Rad;
  const Bx = Math.cos(lat2Rad) * Math.cos(dLng);
  const By = Math.cos(lat2Rad) * Math.sin(dLng);

  const lat3Rad = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2)
  );
  const lng3Rad = lng1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

  return { lat: toDegrees(lat3Rad), lng: toDegrees(lng3Rad) };
};

// Function to find the fair midpoint
const findFairMidpoint = (coordinates) => {
  let maxDistance = 0;
  let point1 = null;
  let point2 = null;

  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const distance = haversineDistance(
        coordinates[i][0],
        coordinates[i][1],
        coordinates[j][0],
        coordinates[j][1]
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        point1 = coordinates[i];
        point2 = coordinates[j];
      }
    }
  }

  return calculateMidpoint(point1[0], point1[1], point2[0], point2[1]);
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
      return res.status(400).json({ error: "Provide at least two coordinate pairs." });
    }
    const midpoint = findFairMidpoint(coordinates);
    res.json({ midpoint });
  } catch (error) {
    console.error("Error calculating midpoint:", error.message);
    res.status(500).json({ error: "Failed to calculate fair midpoint." });
  }
});

app.post("/upload", upload.array("media"), async (req, res) => {
  const { title, content } = req.body;
  const files = req.files;

  try {
    const uploadedMedia = [];
    for (const file of files) {
      const readableStream = fs.createReadStream(file.path);
      const response = await pinata.pinFileToIPFS(readableStream, {
        pinataOptions: { cidVersion: 1 },
      });
      uploadedMedia.push(`https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`);
      fs.unlinkSync(file.path); // Clean up the temporary file
    }

    const metadata = { title, content, media: uploadedMedia };
    const metadataResponse = await pinata.pinJSONToIPFS(metadata, {
      pinataOptions: { cidVersion: 1 },
    });

    res.status(200).json({
      cid: metadataResponse.IpfsHash,
      mediaUrls: uploadedMedia,
    });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    res.status(500).send("Error uploading post.");
  }
});

app.get("/check-env", (req, res) => {
  res.json({ jwt: pinata ? "Loaded" : "Not Initialized" });
});

app.get("/api/blogs", async (req, res) => {
    try {
      // Fetch all blog posts using Pinata's pinList API
      const response = await pinata.pinList({
        metadata: {
          keyvalues: {
            type: { value: "blog_post", op: "eq" }, // tagged posts with "type: blog_post"
          },
        },
      });
  
      const posts = response.rows.map((row) => ({
        id: row.ipfs_pin_hash,
        title: row.metadata.name || "Untitled",
        content: row.metadata.keyvalues?.content || "No content available.",
        media: row.metadata.keyvalues?.media
          ? JSON.parse(row.metadata.keyvalues.media)
          : [],
      }));
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts." });
    }
  });

  app.get("/api/pinata-test", async (req, res) => {
    if (!pinata) {
      console.error("Pinata is not initialized.");
      return res.status(500).json({ success: false, message: "Pinata is not initialized." });
    }
    try {
      const result = await pinata.testAuthentication();
      res.status(200).json({ success: true, message: "Pinata is connected!", result });
    } catch (error) {
      console.error("Pinata connection failed:", error);
      res.status(500).json({ success: false, message: "Failed to connect to Pinata", error: error.message });
    }
  });

// Export the API as a Firebase Function
exports.api = functions.region("us-central1").https.onRequest(app);