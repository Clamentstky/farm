CREATE DATABASE IF NOT EXISTS customer_auth_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE customer_auth_db;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(150) UNIQUE,
  village VARCHAR(150),
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mobile_number (mobile_number),
  INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mobile_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_mobile (mobile_number)
) ENGINE=InnoDB;
