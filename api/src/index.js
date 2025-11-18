// api/src/index.js
const express = require("express");
const cors = require("cors");

const app = express();

// Allow JSON and cross-origin requests (from your phone / Expo)
app.use(cors());
app.use(express.json());

// add this test route:
app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'Backend is reachable' });
});

// Simple health route so mobile app can check backend
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "MindMama backend is running 🎉",
    time: new Date().toISOString(),
  });
});

// Start server, listen on all network interfaces
const PORT = 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});