import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database pool configuration for Aiven
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database Tables
const initDb = async () => {
  try {
    // Main state table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_configs (
        id INT PRIMARY KEY,
        config_json LONGTEXT
      )
    `);

    // Relational tables for Workbench visibility
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(50),
        registered_at VARCHAR(100)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(255),
        phone VARCHAR(50),
        total DECIMAL(10,2),
        status VARCHAR(50),
        type VARCHAR(20),
        created_at VARCHAR(100)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255),
        guests INT,
        date VARCHAR(50),
        time VARCHAR(50),
        status VARCHAR(50),
        created_at VARCHAR(100)
      )
    `);
    console.log("Database tables initialized successfully.");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};
initDb();

// --- RENDER & AIVEN HEALTH API ---
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "connected", database: "aiven_mysql", timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// --- SITE DATA API (GET) ---
app.get("/api/data", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT config_json FROM site_configs WHERE id = 1");
    if (rows.length > 0) {
      res.json(JSON.parse(rows[0].config_json));
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SITE DATA API (POST / SYNC) ---
app.post("/api/data", async (req, res) => {
  try {
    const data = req.body;
    const configJson = JSON.stringify(data);

    // 1. Save entire state for Frontend
    await pool.query(`
      INSERT INTO site_configs (id, config_json) 
      VALUES (1, ?) 
      ON DUPLICATE KEY UPDATE config_json = ?
    `, [configJson, configJson]);

    // 2. Sync Users
    if (data.users && Array.isArray(data.users)) {
      for (const user of data.users) {
        await pool.query(`
          INSERT INTO users (email, name, role, registered_at)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = ?, role = ?
        `, [user.email, user.name, user.role, user.registeredAt, user.name, user.role]);
      }
    }

    // 3. Sync Orders
    if (data.orders && Array.isArray(data.orders)) {
      for (const order of data.orders) {
        await pool.query(`
          INSERT INTO orders (id, customer_name, phone, total, status, type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = ?
        `, [order.id, order.customerName, order.phone, order.total, order.status, order.type, order.createdAt, order.status]);
      }
    }

    // 4. Sync Bookings
    if (data.bookings && Array.isArray(data.bookings)) {
      for (const b of data.bookings) {
        await pool.query(`
          INSERT INTO bookings (id, name, guests, date, time, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = ?
        `, [b.id, b.name, b.guests, b.date, b.time, b.status, b.createdAt, b.status]);
      }
    }

    res.json({ success: true, message: "Sync with Aiven complete" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets from the React build
app.use(express.static(path.join(__dirname, "dist")));

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Ruthy Backend Server running on port ${PORT}`));
