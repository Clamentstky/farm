CREATE DATABASE IF NOT EXISTS farm
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE farm;

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

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(120) NOT NULL UNIQUE,
  category_image VARCHAR(500) NOT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX idx_category_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  product_image VARCHAR(500) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_product_category (category_id),
  INDEX idx_product_name (product_name),
  INDEX idx_product_featured (is_featured),
  INDEX idx_product_status (status)
) ENGINE=InnoDB;

INSERT INTO categories (id, category_name, category_image, status) VALUES
(1, 'Milk & Dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', TRUE),
(2, 'Goat Farm', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=900&q=80', TRUE),
(3, 'Chicken Farm', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80', TRUE),
(4, 'Eggs', 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=80', TRUE),
(5, 'Fresh Water Fish', 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=80', TRUE),
(6, 'Sea Fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80', TRUE),
(7, 'Fresh Water Prawn', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80', TRUE),
(8, 'Sea Prawn', 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=900&q=80', TRUE),
(9, 'Crab', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80', TRUE),
(10, 'Meat', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80', TRUE)
ON DUPLICATE KEY UPDATE
  category_name = VALUES(category_name),
  category_image = VALUES(category_image),
  status = VALUES(status);

INSERT INTO products
(id, category_id, product_name, description, product_image, price, stock, unit, is_featured, status) VALUES
(1, 1, 'A2 Cow Milk', 'Fresh morning cow milk collected from nearby village farms.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', 68.00, 120, 'Litre', TRUE, TRUE),
(2, 1, 'Buffalo Curd', 'Thick homemade-style curd prepared from fresh buffalo milk.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', 55.00, 80, 'Piece', FALSE, TRUE),
(3, 2, 'Goat Milk', 'Light, farm-fresh goat milk packed for same-day delivery.', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=900&q=80', 110.00, 40, 'Litre', TRUE, TRUE),
(4, 2, 'Goat Meat Curry Cut', 'Cleaned goat meat pieces suitable for curry and gravy.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80', 760.00, 26, 'Kg', FALSE, TRUE),
(5, 3, 'Country Chicken', 'Native farm chicken with rich flavour and firm texture.', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80', 420.00, 34, 'Kg', TRUE, TRUE),
(6, 3, 'Broiler Chicken', 'Fresh cleaned broiler chicken for quick family meals.', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80', 220.00, 65, 'Kg', FALSE, TRUE),
(7, 4, 'Country Eggs', 'Protein-rich brown country eggs from free-range hens.', 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=900&q=80', 14.00, 240, 'Piece', TRUE, TRUE),
(8, 4, 'White Eggs', 'Fresh white eggs packed in clean trays.', 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&w=900&q=80', 8.00, 360, 'Piece', FALSE, TRUE),
(9, 5, 'Rohu Fish', 'Fresh water rohu cleaned and cut on order.', 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=80', 210.00, 48, 'Kg', TRUE, TRUE),
(10, 5, 'Catla Fish', 'Tender fresh water catla with mild flavour.', 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=900&q=80', 230.00, 42, 'Kg', FALSE, TRUE),
(11, 6, 'Seer Fish', 'Premium sea fish slices, cleaned and ready to cook.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80', 780.00, 22, 'Kg', TRUE, TRUE),
(12, 6, 'Sardine', 'Fresh sardines ideal for fry and curry.', 'https://images.unsplash.com/photo-1553557202-e8e60357f061?auto=format&fit=crop&w=900&q=80', 180.00, 70, 'Kg', FALSE, TRUE),
(13, 7, 'Fresh Water Prawn', 'Medium fresh water prawns cleaned for curry or fry.', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80', 520.00, 30, 'Kg', TRUE, TRUE),
(14, 8, 'Sea Tiger Prawn', 'Large sea prawns with firm texture and sweet taste.', 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=900&q=80', 680.00, 24, 'Kg', TRUE, TRUE),
(15, 9, 'Live Mud Crab', 'Fresh mud crab sourced from coastal suppliers.', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80', 640.00, 18, 'Kg', FALSE, TRUE),
(16, 10, 'Mutton Curry Cut', 'Fresh mutton pieces cleaned and portioned for cooking.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80', 820.00, 20, 'Kg', TRUE, TRUE)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  product_name = VALUES(product_name),
  description = VALUES(description),
  product_image = VALUES(product_image),
  price = VALUES(price),
  stock = VALUES(stock),
  unit = VALUES(unit),
  is_featured = VALUES(is_featured),
  status = VALUES(status);
