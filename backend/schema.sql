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
  images TEXT,
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

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_cart_customer_product (customer_id, product_id),
  INDEX idx_cart_customer (customer_id),
  INDEX idx_cart_product (product_id)
) ENGINE=InnoDB;

INSERT INTO categories (id, category_name, category_image, status) VALUES
(1, 'Milk & Dairy', '/product-images/milk1.jpg', TRUE),
(2, 'Goat Farm', '/product-images/goat%20farm.jpg', TRUE),
(3, 'Chicken Farm', '/product-images/chicken3.jpg', TRUE),
(4, 'Eggs', '/product-images/eggs2.jpg', TRUE),
(5, 'Fresh Water Fish', '/product-images/fresh%20water%20fish.jpg', TRUE),
(6, 'Sea Fish', '/product-images/sea%20fish.jpg', TRUE),
(7, 'Fresh Water Prawn', '/product-images/fresh%20water%20prawn.jpg', TRUE),
(8, 'Sea Prawn', '/product-images/sea%20prawn.jpg', TRUE),
(9, 'Crab', '/product-images/crab.jpg', TRUE),
(10, 'Meat', '/product-images/meat.jpg', TRUE)
ON DUPLICATE KEY UPDATE
  category_name = VALUES(category_name),
  category_image = VALUES(category_image),
  status = VALUES(status);

INSERT INTO products
(id, category_id, product_name, description, product_image, images, price, stock, unit, is_featured, status) VALUES
(1, 1, 'A2 Cow Milk', 'Fresh morning cow milk collected from nearby village farms.', '/product-images/milk2.jpg', '["/product-images/milk3.jpg","/product-images/fresh-cow-milk4.jpg"]', 68.00, 120, 'Litre', TRUE, TRUE),
(2, 1, 'Buffalo Curd', 'Thick homemade-style curd prepared from fresh buffalo milk.', '/product-images/curd1.jpg', NULL, 55.00, 80, 'Piece', FALSE, TRUE),
(3, 2, 'Goat Milk', 'Light, farm-fresh goat milk packed for same-day delivery.', '/product-images/goat2.jpg', NULL, 110.00, 40, 'Litre', TRUE, TRUE),
(4, 2, 'Goat Meat Curry Cut', 'Cleaned goat meat pieces suitable for curry and gravy.', '/product-images/goat-meat.jpg', NULL, 760.00, 26, 'Kg', FALSE, TRUE),
(5, 3, 'Country Chicken', 'Native farm chicken with rich flavour and firm texture.', '/product-images/country%20chicken1.jpg', '["/product-images/country%20chicken2.jpg","/product-images/country%20chicken3.jpg"]', 420.00, 34, 'Kg', TRUE, TRUE),
(6, 3, 'Broiler Chicken', 'Fresh cleaned broiler chicken for quick family meals.', '/product-images/broiler-chicken.jpg', NULL, 220.00, 65, 'Kg', FALSE, TRUE),
(7, 4, 'Country Eggs', 'Protein-rich brown country eggs from free-range hens.', '/product-images/eggs1.jpg', NULL, 14.00, 240, 'Piece', TRUE, TRUE),
(8, 4, 'White Eggs', 'Fresh white eggs packed in clean trays.', '/product-images/white%20egg1.jpg', NULL, 8.00, 360, 'Piece', FALSE, TRUE),
(9, 5, 'Rohu Fish', 'Fresh water rohu cleaned and cut on order.', '/product-images/rohu%20fish1.jpg', NULL, 210.00, 48, 'Kg', TRUE, TRUE),
(10, 5, 'Catla Fish', 'Tender fresh water catla with mild flavour.', '/product-images/Catla%20Fish1.jpg', '["/product-images/Catla%20Fish2.jpg","/product-images/Catla%20Fish3.jpg"]', 230.00, 42, 'Kg', FALSE, TRUE),
(11, 6, 'Seer Fish', 'Premium sea fish slices, cleaned and ready to cook.', '/product-images/seer1.jpg', NULL, 780.00, 22, 'Kg', TRUE, TRUE),
(12, 6, 'Sardine', 'Fresh sardines ideal for fry and curry.', '/product-images/sardine1.jpg', NULL, 180.00, 70, 'Kg', FALSE, TRUE),
(13, 7, 'Fresh Water Prawn', 'Medium fresh water prawns cleaned for curry or fry.', '/product-images/prawn1.jpg', NULL, 520.00, 30, 'Kg', TRUE, TRUE),
(14, 8, 'Sea Tiger Prawn', 'Large sea prawns with firm texture and sweet taste.', '/product-images/Sea%20Tiger%20Prawn1.jpg', '["/product-images/Sea%20Tiger%20Prawn2.jpg","/product-images/Sea%20Tiger%20Prawn3.jpg"]', 680.00, 24, 'Kg', TRUE, TRUE),
(15, 9, 'Live Mud Crab', 'Fresh mud crab sourced from coastal suppliers.', '/product-images/live%20mud%20crab1.jpg', '["/product-images/Live%20Mud%20Crab2.jpg","/product-images/Live%20Mud%20Crab3.jpg"]', 640.00, 18, 'Kg', FALSE, TRUE),
(16, 10, 'Mutton Curry Cut', 'Fresh mutton pieces cleaned and portioned for cooking.', '/product-images/Mutton%20Curry%20Cut1.jpg', '["/product-images/Mutton%20Curry%20Cut2.jpg","/product-images/Mutton%20Curry%20Cut3.jpg"]', 820.00, 20, 'Kg', TRUE, TRUE),
(17, 1, 'Fresh Cow Milk', 'Creamy cow milk chilled and packed for daily household use.', '/product-images/fresh-cow-milk1.jpg', '["/product-images/fresh-cow-milk2.jpg","/product-images/fresh-cow-milk3.jpg"]', 64.00, 100, 'Litre', FALSE, TRUE),
(18, 2, 'Tender Goat Curry Cut', 'Tender goat meat pieces trimmed and packed for slow-cooked curries.', '/product-images/Tender%20Goat%20Curry%20Cut1.jpg', '["/product-images/Tender%20Goat%20Curry%20Cut2.jpg","/product-images/Tender%20Goat%20Curry%20Cut3.jpg"]', 780.00, 22, 'Kg', FALSE, TRUE),
(19, 3, 'Chicken Curry Cut', 'Clean chicken curry cut portions prepared fresh for family meals.', '/product-images/Chicken%20Curry%20Cut1.jpg', '["/product-images/Chicken%20Curry%20Cut2.jpg","/product-images/Chicken%20Curry%20Cut3.jpg"]', 260.00, 52, 'Kg', FALSE, TRUE),
(20, 4, 'Duck Eggs', 'Rich duck eggs selected from local farms for baking and cooking.', '/product-images/Duck%20Eggs1.jpg', '["/product-images/Duck%20Eggs2.jpg","/product-images/Duck%20Eggs3.jpg"]', 18.00, 150, 'Piece', FALSE, TRUE),
(21, 5, 'Fresh Catla Slices', 'Fresh water catla slices cleaned and packed on order.', '/product-images/Fresh%20Catla%20Slices1.jpg', '["/product-images/Fresh%20Catla%20Slices2.jpg","/product-images/Fresh%20Catla%20Slices3.jpg"]', 250.00, 36, 'Kg', FALSE, TRUE),
(22, 6, 'Pomfret Fish', 'Fresh sea pomfret cleaned whole for fry, grill, or curry.', '/product-images/Pomfret%20Fish1.jpg', NULL, 720.00, 20, 'Kg', FALSE, TRUE),
(23, 7, 'River Prawn', 'River prawns sorted by size and packed fresh for quick cooking.', '/product-images/River%20Prawn1.jpg', '["/product-images/River%20Prawn2.jpg","/product-images/River%20Prawn3.jpg"]', 560.00, 28, 'Kg', FALSE, TRUE),
(24, 7, 'Jumbo Fresh Water Prawn', 'Large fresh water prawns with firm texture for roast and curry.', '/product-images/Jumbo%20Fresh%20Water%20Prawn1.jpg', '["/product-images/Jumbo%20Fresh%20Water%20Prawn2.jpg","/product-images/Jumbo%20Fresh%20Water%20Prawn3.jpg"]', 640.00, 18, 'Kg', FALSE, TRUE),
(25, 8, 'Medium Sea Prawn', 'Medium sea prawns cleaned and ready for fry or gravy.', '/product-images/Medium%20Sea%20Prawn1.jpg', '["/product-images/Medium%20Sea%20Prawn2.jpg","/product-images/Medium%20Sea%20Prawn3.jpg"]', 620.00, 26, 'Kg', FALSE, TRUE),
(26, 8, 'Jumbo Sea Prawn', 'Jumbo sea prawns packed fresh for special seafood meals.', '/product-images/Jumbo%20Sea%20Prawn1.jpg', '["/product-images/Jumbo%20Sea%20Prawn2.jpg","/product-images/Jumbo%20Sea%20Prawn3.jpg"]', 760.00, 16, 'Kg', FALSE, TRUE),
(27, 9, 'Blue Crab', 'Fresh blue crab cleaned and packed for coastal-style curries.', '/product-images/Blue%20Crab1.jpg', '["/product-images/Blue%20Crab2.jpg","/product-images/Blue%20Crab3.jpg"]', 580.00, 24, 'Kg', TRUE, TRUE),
(28, 9, 'Crab Claws', 'Meaty crab claws selected for soups, masala, and pepper fry.', '/product-images/Crab%20Claws1.jpg', '["/product-images/Crab%20Claws2.jpg","/product-images/Crab%20Claws3.jpg"]', 700.00, 14, 'Kg', FALSE, TRUE),
(29, 10, 'Boneless Mutton', 'Lean boneless mutton pieces trimmed for biryani, fry, and curry.', '/product-images/Boneless%20Mutton1.jpg', '["/product-images/Boneless%20Mutton2.jpg","/product-images/Boneless%20Mutton3.jpg"]', 980.00, 15, 'Kg', FALSE, TRUE),
(30, 10, 'Meat Curry Mix', 'Mixed fresh meat cuts portioned for everyday curry preparation.', '/product-images/Meat%20Curry%20Mix1.jpg', '["/product-images/Meat%20Curry%20Mix2.jpg","/product-images/mutton1.jpg"]', 760.00, 24, 'Kg', FALSE, TRUE)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  product_name = VALUES(product_name),
  description = VALUES(description),
  product_image = VALUES(product_image),
  images = VALUES(images),
  price = VALUES(price),
  stock = VALUES(stock),
  unit = VALUES(unit),
  is_featured = VALUES(is_featured),
  status = VALUES(status);

CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
