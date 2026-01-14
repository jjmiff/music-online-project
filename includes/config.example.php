<?php
/**
 * Configuration File - Example
 * Copy this file to config.php and update with your settings
 */

// Database Configuration for XAMPP
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP MySQL password is empty
define('DB_NAME', 'musiconline');

// Site Configuration
define('SITE_URL', 'http://localhost/music-online-project');
define('SITE_NAME', 'musicOnline. com');

// Security Settings
define('SESSION_LIFETIME', 3600); // 1 hour in seconds
define('PASSWORD_MIN_LENGTH', 8);

// Pagination
define('RESULTS_PER_PAGE', 12);

// File Upload Settings (for future use)
define('MAX_FILE_SIZE', 5242880); // 5MB in bytes
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif']);
define('UPLOAD_PATH', __DIR__ . '/../assets/images/uploads/');

// Error Reporting
// Set to 0 in production, E_ALL for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Europe/London'); // Adjust to your timezone

// Application Environment
define('ENVIRONMENT', 'development'); // development | production
?>