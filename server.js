/**
 * PRODUCTION NODE.JS SERVER FOR RENDER + AIVEN
 */

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Aiven MySQL Connection
let db;
if (process.env.AIVEN_URL) {
  db = mysql.createPool(process.env.AIVEN_URL);
} else {
  console.warn("WARNING: AIVEN_URL not set. Backend will not persist to cloud.");
  db = { query: () => Promise.resolve([{ config_json: "{}" }]) };
}

// Initialize Database Table
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_configs (
        id INT PRIMARY KEY,
        config_json LONGTEXT
      )
    `);
  } catch (err) {
    console.error("DB Init Error:", err.message);
  }
};
initDb();

// --- API ROUTES ---
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT config_json FROM site_configs WHERE id = 1');
    if (rows.length > 0) res.json(JSON.parse(rows[0].config_json));
    else res.status(404).json({ message: "No data found" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/data', async (req, res) => {
  try {
    const config = JSON.stringify(req.body);
    await db.query(`
      INSERT INTO site_configs (id, config_json) VALUES (1, ?) 
      ON DUPLICATE KEY UPDATE config_json = ?
    `, [config, config]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// --- SERVE FRONTEND ---
// 2. Tell Express to serve the static files from the "dist" folder
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Handle any other requests by sending the index.html file (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Ruthy Backend Server is Live on Port ${PORT}`);
});
