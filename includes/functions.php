<?php
/**
 * Utility Functions Library
 * Contains security, session, validation, and helper functions
 */

// ============================================
// SECURITY FUNCTIONS
// ============================================

/**
 * Sanitize user input
 * @param string $data
 * @return string
 */
function sanitize_input($data) {
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email address
 * @param string $email
 * @return bool
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate password strength
 * @param string $password
 * @return array ['valid' => bool, 'message' => string]
 */
function validate_password($password) {
    $result = ['valid' => true, 'message' => ''];
    
    if (strlen($password) < PASSWORD_MIN_LENGTH) {
        $result['valid'] = false;
        $result['message'] = 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters long.';
        return $result;
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        $result['valid'] = false;
        $result['message'] = 'Password must contain at least one uppercase letter.';
        return $result;
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        $result['valid'] = false;
        $result['message'] = 'Password must contain at least one lowercase letter.';
        return $result;
    }
    
    if (!preg_match('/[0-9]/', $password)) {
        $result['valid'] = false;
        $result['message'] = 'Password must contain at least one number. ';
        return $result;
    }
    
    return $result;
}

/**
 * Hash password securely
 * @param string $password
 * @return string
 */
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verify password against hash
 * @param string $password
 * @param string $hash
 * @return bool
 */
function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Start secure session
 */
function start_secure_session() {
    if (session_status() === PHP_SESSION_NONE) {
        // Security settings
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
        ini_set('session.cookie_samesite', 'Strict');
        
        session_start();
        
        // Regenerate session ID periodically
        if (! isset($_SESSION['created'])) {
            $_SESSION['created'] = time();
        } elseif (time() - $_SESSION['created'] > 1800) {
            session_regenerate_id(true);
            $_SESSION['created'] = time();
        }
        
        // Check session timeout
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_LIFETIME)) {
            session_unset();
            session_destroy();
            start_secure_session();
        }
        $_SESSION['last_activity'] = time();
    }
}

/**
 * Check if user is logged in
 * @return bool
 */
function is_logged_in() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Check if admin is logged in
 * @return bool
 */
function is_admin_logged_in() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

/**
 * Require user login - redirect if not logged in
 */
function require_login() {
    if (!is_logged_in()) {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        redirect(SITE_URL . '/login. php');
    }
}

/**
 * Require admin login - redirect if not logged in
 */
function require_admin() {
    if (!is_admin_logged_in()) {
        redirect(SITE_URL . '/admin/login.php');
    }
}

/**
 * Logout user and destroy session
 */
function logout_user() {
    session_unset();
    session_destroy();
    redirect(SITE_URL . '/index.php');
}

/**
 * Logout admin and destroy session
 */
function logout_admin() {
    session_unset();
    session_destroy();
    redirect(SITE_URL . '/admin/login.php');
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 * @return string
 */
function generate_csrf_token() {
    if (! isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 * @param string $token
 * @return bool
 */
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Output CSRF token as hidden input field
 */
function csrf_token_field() {
    $token = generate_csrf_token();
    echo '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Redirect to URL
 * @param string $url
 */
function redirect($url) {
    header("Location:  " . $url);
    exit();
}

/**
 * Format price with currency symbol
 * @param float $price
 * @return string
 */
function format_price($price) {
    return '£' . number_format($price, 2);
}

/**
 * Format date for display
 * @param string $date
 * @param string $format
 * @return string
 */
function format_date($date, $format = 'd M Y') {
    return date($format, strtotime($date));
}

/**
 * Get Bootstrap badge class for vinyl type
 * @param string $type
 * @return string
 */
function get_vinyl_type_badge($type) {
    $badges = [
        'album' => 'primary',
        'single' => 'success',
        'ep' => 'info'
    ];
    return $badges[$type] ?? 'secondary';
}

/**
 * Truncate text to specified length
 * @param string $text
 * @param int $length
 * @param string $suffix
 * @return string
 */
function truncate_text($text, $length = 100, $suffix = '... ') {
    if (strlen($text) <= $length) {
        return $text;
    }
    return substr($text, 0, $length) . $suffix;
}

/**
 * Display success message
 * @param string $message
 */
function show_success($message) {
    echo '<div class="alert alert-success alert-dismissible fade show" role="alert">';
    echo htmlspecialchars($message);
    echo '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    echo '</div>';
}

/**
 * Display error message
 * @param string $message
 */
function show_error($message) {
    echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
    echo htmlspecialchars($message);
    echo '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    echo '</div>';
}

/**
 * Display info message
 * @param string $message
 */
function show_info($message) {
    echo '<div class="alert alert-info alert-dismissible fade show" role="alert">';
    echo htmlspecialchars($message);
    echo '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    echo '</div>';
}

/**
 * Get current page name
 * @return string
 */
function get_current_page() {
    return basename($_SERVER['PHP_SELF']);
}

/**
 * Check if current page is active (for navigation)
 * @param string $page
 * @return string
 */
function is_active_page($page) {
    return get_current_page() === $page ?  'active' : '';
}

/**
 * Generate pagination HTML
 * @param int $current_page
 * @param int $total_pages
 * @param string $base_url
 * @return string
 */
function generate_pagination($current_page, $total_pages, $base_url) {
    if ($total_pages <= 1) {
        return '';
    }
    
    $html = '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';
    
    // Previous button
    if ($current_page > 1) {
        $html .= '<li class="page-item"><a class="page-link" href="' . $base_url .  '&page=' . ($current_page - 1) . '">Previous</a></li>';
    }
    
    // Page numbers
    for ($i = 1; $i <= $total_pages; $i++) {
        $active = ($i == $current_page) ? ' active' : '';
        $html .= '<li class="page-item' . $active . '"><a class="page-link" href="' . $base_url . '&page=' . $i . '">' . $i . '</a></li>';
    }
    
    // Next button
    if ($current_page < $total_pages) {
        $html .= '<li class="page-item"><a class="page-link" href="' . $base_url . '&page=' . ($current_page + 1) . '">Next</a></li>';
    }
    
    $html .= '</ul></nav>';
    
    return $html;
}
?>