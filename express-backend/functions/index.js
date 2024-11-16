const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sample route
app.get("/greeting", (req, res) => {
    res.json({message: "Hello huzz!"});
});

exports.api = functions.region("us-central1").https.onRequest(app);
