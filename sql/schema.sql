-- ============================================
-- musicOnline.com Database Schema
-- Dynamic Vinyl Music Marketplace
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS musiconline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE musiconline;

-- ============================================
-- Users Table
-- Stores registered user information
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('individual', 'retailer') NOT NULL DEFAULT 'individual',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB;

-- ============================================
-- Admin Users Table
-- Stores administrator accounts
-- ============================================
CREATE TABLE admin_users (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- ============================================
-- Vinyl Listings Table
-- Stores all vinyl records for sale
-- ============================================
CREATE TABLE vinyl_listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    vinyl_type ENUM('album', 'single', 'ep') NOT NULL,
    genre VARCHAR(50),
    release_date DATE,
    condition_grade ENUM('Mint', 'Near Mint', 'Very Good Plus', 'Very Good', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) DEFAULT 'assets/images/placeholder-vinyl.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_artist (artist_name),
    INDEX idx_title (title),
    INDEX idx_vinyl_type (vinyl_type),
    INDEX idx_user_id (user_id),
    INDEX idx_is_approved (is_approved),
    FULLTEXT idx_search (artist_name, title, description)
) ENGINE=InnoDB;

-- ============================================
-- Insert Default Admin Account
-- Username: admin
-- Password: Admin123!
-- ============================================
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@musiconline.com');

-- ============================================
-- Insert Sample Users
-- Password for both: Test123!
-- ============================================
INSERT INTO users (username, email, password_hash, user_type, first_name, last_name) VALUES 
('john_vinyl', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi. Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'individual', 'John', 'Smith'),
('vinyl_shop', 'shop@vinylstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'retailer', 'Vinyl', 'Store');

-- ============================================
-- Insert Sample Vinyl Listings
-- ============================================
INSERT INTO vinyl_listings (user_id, artist_name, title, vinyl_type, genre, release_date, condition_grade, price, description, is_approved) VALUES
(1, 'The Beatles', 'Abbey Road', 'album', 'Rock', '1969-09-26', 'Near Mint', 45.99, 'Classic Beatles album in excellent condition.  Original UK pressing with all inserts. ', TRUE),
(1, 'Pink Floyd', 'The Dark Side of the Moon', 'album', 'Progressive Rock', '1973-03-01', 'Very Good Plus', 35.50, 'Iconic progressive rock masterpiece. Original pressing with slight wear on sleeve.', TRUE),
(1, 'Fleetwood Mac', 'Rumours', 'album', 'Rock', '1977-02-04', 'Very Good', 28.00, 'Best-selling album, classic 70s rock.  Vinyl in great condition.', TRUE),
(2, 'David Bowie', 'Space Oddity', 'single', 'Rock', '1969-07-11', 'Mint', 29.99, 'Sealed original 7-inch single. Rare collector item.', TRUE),
(2, 'Led Zeppelin', 'Led Zeppelin IV', 'album', 'Rock', '1971-11-08', 'Very Good', 42.00, 'Contains "Stairway to Heaven".  Classic hard rock album in good condition.', TRUE),
(2, 'The Clash', 'London Calling', 'album', 'Punk Rock', '1979-12-14', 'Near Mint', 38.75, 'Double album, punk rock classic. Excellent condition with original inner sleeves.', TRUE),
(1, 'Queen', 'Bohemian Rhapsody', 'single', 'Rock', '1975-10-31', 'Good', 15.50, '7-inch single of the iconic Queen track. Some surface wear but plays well.', TRUE),
(2, 'Nirvana', 'Nevermind', 'album', 'Grunge', '1991-09-24', 'Near Mint', 55.00, 'Grunge masterpiece. First pressing in near-perfect condition.', TRUE);

-- ============================================
-- Verification Queries (commented out)
-- ============================================
-- SELECT * FROM users;
-- SELECT * FROM admin_users;
-- SELECT * FROM vinyl_listings;