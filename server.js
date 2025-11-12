const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Allow CORS so the frontend on GitHub Pages can call this backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/fetch-torrent', async (req, res) => {
  const { url, user, pass } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  let headers = {};
  if (user && pass) {
    headers['Authorization'] = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Error fetching file");

    const buffer = await response.buffer();
    res.set('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
