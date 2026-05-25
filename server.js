import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ================= DATABASE =================

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ================= INIT DATABASE =================

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_configs (
        id INT PRIMARY KEY,
        config_json LONGTEXT
      )
    `);

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

    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  }
};

initDb();

// ================= HEALTH CHECK =================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "connected",
      database: "aiven_mysql",
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// ================= GET DATA =================

app.get("/api/data", async (req, res) => {
  try {
    const [configRows] = await pool.query(
      "SELECT config_json FROM site_configs WHERE id = 1"
    );

    let data = configRows.length > 0
      ? JSON.parse(configRows[0].config_json)
      : {};

    const [users] = await pool.query("SELECT * FROM users");
    const [orders] = await pool.query("SELECT * FROM orders");
    const [bookings] = await pool.query("SELECT * FROM bookings");

    data.users = users;
    data.orders = orders;
    data.bookings = bookings;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= SAVE DATA =================

app.post("/api/data", async (req, res) => {
  try {
    const data = req.body;

    const configJson = JSON.stringify(data);

    await pool.query(
      `
      INSERT INTO site_configs (id, config_json)
      VALUES (1, ?)
      ON DUPLICATE KEY UPDATE config_json = ?
    `,
      [configJson, configJson]
    );

    // USERS
    if (Array.isArray(data.users)) {
      for (const user of data.users) {
        await pool.query(
          `
          INSERT INTO users (email, name, role, registered_at)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          role = VALUES(role)
        `,
          [
            user.email,
            user.name,
            user.role,
            user.registeredAt,
          ]
        );
      }
    }

    // ORDERS
    if (Array.isArray(data.orders)) {
      for (const order of data.orders) {
        await pool.query(
          `
          INSERT INTO orders (
            id,
            customer_name,
            phone,
            total,
            status,
            type,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          status = VALUES(status)
        `,
          [
            order.id,
            order.customerName,
            order.phone,
            order.total,
            order.status,
            order.type,
            order.createdAt,
          ]
        );
      }
    }

    // BOOKINGS
    if (Array.isArray(data.bookings)) {
      for (const booking of data.bookings) {
        await pool.query(
          `
          INSERT INTO bookings (
            id,
            name,
            guests,
            date,
            time,
            status,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          status = VALUES(status)
        `,
          [
            booking.id,
            booking.name,
            booking.guests,
            booking.date,
            booking.time,
            booking.status,
            booking.createdAt,
          ]
        );
      }
    }

    res.json({
      success: true,
      message: "✅ Sync complete",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= STATIC FILES =================

const distPath = path.join(__dirname, "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("⚠️ dist folder not found");
}

// ================= START SERVER =================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
