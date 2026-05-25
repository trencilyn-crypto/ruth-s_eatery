-- Ruthy Eatery - MySQL Database Schema
-- Use this script in MySQL Workbench or Aiven Console

-- 1. Create the database (if not using default)
CREATE DATABASE IF NOT EXISTS ruthy_eatery;
USE ruthy_eatery;

-- 2. Main Configuration Table
-- This table stores the entire website state (Menu, Themes, Settings) in a JSON format.
-- This approach allows for maximum flexibility with the frontend editor.
CREATE TABLE IF NOT EXISTS site_configs (
    id INT PRIMARY KEY,
    config_json LONGTEXT NOT NULL
);

-- 3. Initial Admin Record (Optional if not handled by server.js)
-- Note: The Node.js server is designed to 'upsert' this row automatically.
-- INSERT INTO site_configs (id, config_json) VALUES (1, '{}') ON DUPLICATE KEY UPDATE id=1;

-- ---------------------------------------------------------
-- OPTIONAL: Normalized Schema
-- If you want to view/query data as individual columns in Workbench
-- ---------------------------------------------------------

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(255),
    customer_name VARCHAR(255),
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    order_type VARCHAR(20),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(email)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(255),
    guest_name VARCHAR(255),
    booking_date DATE,
    booking_time TIME,
    guests INT,
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(email)
);
