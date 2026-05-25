/**
 * PRODUCTION NODE.JS SERVER FOR RENDER + AIVEN
 * 1. Install dependencies: npm install express cors mysql2 dotenv body-parser
 * 2. Set your AIVEN_URL in Render Environment Variables
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Aiven MySQL Connection
let db;
if (process.env.AIVEN_URL) {
  const pool = mysql.createPool(process.env.AIVEN_URL);
  db = pool.promise();
} else {
  console.warn("WARNING: AIVEN_URL not set. Backend will not persist to cloud.");
  // Mock db object to prevent crashes
  db = {
    query: () => Promise.resolve([{ config_json: "{}" }]),
    promise: () => db
  };
}

// Initialize Database Table if it doesn't exist
const initDb = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_configs (
      id INT PRIMARY KEY,
      config_json LONGTEXT
    )
  `);
};
initDb();

// GET Site Data from Aiven
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT config_json FROM site_configs WHERE id = 1');
    if (rows.length > 0) {
      res.json(JSON.parse(rows[0].config_json));
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Site Data to Aiven
app.post('/api/data', async (req, res) => {
  try {
    const config = JSON.stringify(req.body);
    // Upsert logic: insert or update the single config row
    await db.query(`
      INSERT INTO site_configs (id, config_json) 
      VALUES (1, ?) 
      ON DUPLICATE KEY UPDATE config_json = ?
    `, [config, config]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check for Render & Aiven
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'connected', database: 'aiven_mysql', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Ruthy Backend Server is Live on Port ${PORT}`);
});
