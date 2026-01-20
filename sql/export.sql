-- Music Online Database Export
-- Generated: 2026-01-20T01:50:32.842Z

-- Table structure for table `genres`
DROP TABLE IF EXISTS `genres`;
CREATE TABLE `genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `genres`
INSERT INTO `genres` VALUES
(4, 'Classical'),
(7, 'Country'),
(6, 'Electronic'),
(5, 'Hip Hop'),
(3, 'Jazz'),
(2, 'Pop'),
(8, 'Reggae'),
(1, 'Rock');

-- Table structure for table `search_logs`
DROP TABLE IF EXISTS `search_logs`;
CREATE TABLE `search_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term` varchar(255) NOT NULL,
  `search_count` int(11) DEFAULT 1,
  `last_searched_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_term` (`term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','retailer') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `users`
INSERT INTO `users` VALUES
(5, 'admin', 'admin@example.com', '$2b$10$5LGZwNewgvDZd/dLoJ0U6O4ChWElA0H8M/hD2jYopUe3KnpxSNalS', 'admin', '2026-01-19 23:48:27', 'approved'),
(6, 'seller_approved', 'seller@example.com', '$2b$10$5LGZwNewgvDZd/dLoJ0U6OlButTEN/ZShPgnEpIbBR2sgTS25v1d6', 'user', '2026-01-19 23:48:27', 'approved'),
(7, 'seller_pending', 'pending@example.com', '$2b$10$5LGZwNewgvDZd/dLoJ0U6OlButTEN/ZShPgnEpIbBR2sgTS25v1d6', 'user', '2026-01-19 23:48:27', 'approved'),
(8, 'buyer', 'buyer@example.com', '$2b$10$5LGZwNewgvDZd/dLoJ0U6OlButTEN/ZShPgnEpIbBR2sgTS25v1d6', 'user', '2026-01-19 23:48:27', 'approved'),
(9, 'debug_admin_1768873448533', 'debug_admin_1768873448533@test.com', '$2b$10$bwWTCcjOC/LIq.b3ans.WuFzYIzXMbEIe3K2qRlXL.cLkruX0r9i6', 'admin', '2026-01-20 01:44:08', 'approved'),
(10, 'target_user_1768873448533', 'target_user_1768873448533@test.com', '$2b$10$BlJ5b1bjcRFhNSpymhn.2eTCP1ze2vzcpqAq2DCTFirdtrWN9GI26', 'user', '2026-01-20 01:44:08', 'pending'),
(11, 'debug_admin_1768873507005', 'debug_admin_1768873507005@test.com', '$2b$10$x18zlbXbI/eHdbMjbDHcj.HWdIjzmcc9nVRBo6wg5HdXE6zCXgAl6', 'admin', '2026-01-20 01:45:07', 'approved'),
(12, 'target_user_1768873507005', 'target_user_1768873507005@test.com', '$2b$10$rzhfRSDGKyzAkK2XFKVzNOPDEK497EULT/3QzH.I.y4mv4dfboUeO', 'user', '2026-01-20 01:45:07', 'pending'),
(13, 'debug_admin_1768873607231', 'debug_admin_1768873607231@test.com', '$2b$10$MSW1A1AbjlVqH18F7jy/uOLybfQS/pssSnl5MfapxaQdOAIL2oY7i', 'admin', '2026-01-20 01:46:47', 'approved'),
(14, 'target_user_1768873607231', 'target_user_1768873607231@test.com', '$2b$10$jfo5VRBpopwYHJopEvw6v..op6gsV/v5.nAPftuS6Gy/Z0oRDsZuu', 'user', '2026-01-20 01:46:47', 'pending');

-- Table structure for table `vinyls`
DROP TABLE IF EXISTS `vinyls`;
CREATE TABLE `vinyls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `artist` varchar(100) NOT NULL,
  `type` enum('album','single','ep') NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `seller_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `vinyls_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `vinyls`
INSERT INTO `vinyls` VALUES
(32, 'Dark Side of the Moon', 'Pink Floyd', 'album', 'A masterpiece of psychedelic rock, featuring extended instrumentals and profound lyrics about the human condition.', '25.00', '2026-01-19 00:00:00', '/uploads/vinyl-migrated-1768858832281-179603466-large.webp', 6, '2026-01-19 23:48:27', 'approved'),
(33, 'Rumours', 'Fleetwood Mac', 'album', 'One of the best-selling albums of all time, known for its emotional lyrics and intricate harmonies born from band conflict.', '20.00', '2026-01-19 00:00:00', '/uploads/vinyl-migrated-1768858832677-834251773-large.webp', 6, '2026-01-19 23:48:27', 'approved'),
(34, 'Nevermind', 'Nirvana', 'album', 'The album that defined a generation, bringing grunge to the mainstream with its raw energy and catchy hooks.', '30.00', '2026-01-19 00:00:00', '/uploads/vinyl-migrated-1768858832868-820112725-large.webp', 6, '2026-01-19 23:48:27', 'approved'),
(35, 'OK Computer', 'Radiohead', 'album', 'A dystopian electronic rock opera that challenged the conventions of alternative music in the late 90s.', '22.50', '2026-01-19 00:00:00', '/uploads/vinyl-migrated-1768858833024-259857211-large.webp', 6, '2026-01-19 23:48:27', 'approved'),
(36, 'Abbey Road', 'The Beatles', 'album', 'A revolutionary album that changed the course of pop music with its experimental studio techniques and diverse songwriting.', '35.00', '2026-01-19 00:00:00', '/uploads/vinyl-migrated-1768858833193-961425590-large.webp', 6, '2026-01-19 23:48:27', 'approved'),
(37, 'Garage Demos', 'Unknown Artist', 'ep', 'Raw recordings from the garage.', '10.00', '2026-01-19 00:00:00', 'https://placehold.co/600x600/222222/FFF?text=Unknown+Artist', 7, '2026-01-19 23:48:27', 'approved'),
(38, 'Summer Vibes', 'Indie Band', 'single', 'The hit single of the summer.', '5.00', '2026-01-19 00:00:00', 'https://placehold.co/600x600/1a1a1a/FFF?text=Indie+Band', 6, '2026-01-19 23:48:27', 'approved');

