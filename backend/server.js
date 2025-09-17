const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store sensor data in memory
let sensorData = [];

// POST endpoint to receive sensor data
app.post("/api/sensor", (req, res) => {
  const { tds, temperature } = req.body;

  if (tds === undefined || temperature === undefined) {
    return res.status(400).json({ message: "TDS and Temperature required" });
  }

  const dataEntry = {
    tds,
    temperature,
    timestamp: new Date()
  };

  sensorData.push(dataEntry);
  console.log("Data received:", dataEntry);

  res.status(200).json({ message: "Data received", data: dataEntry });
});

// GET endpoint to fetch all sensor data
app.get("/api/sensor", (req, res) => {
  res.json(sensorData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
