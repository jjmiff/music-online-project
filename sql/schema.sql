-- Database Creation
CREATE DATABASE IF NOT EXISTS `music-onlineV2`;
USE `music-onlineV2`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'admin', 'retailer') DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vinyls Table
CREATE TABLE IF NOT EXISTS `vinyls` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `artist` VARCHAR(100) NOT NULL,
    `type` ENUM('album', 'single', 'ep') NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10, 2),
    `release_date` DATE,
    `image_url` VARCHAR(255),
    `seller_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
