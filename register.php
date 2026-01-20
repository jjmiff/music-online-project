<?php
/**
 * Register Page
 */

require_once 'includes/config.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

start_secure_session();

if (is_logged_in()) {
    redirect('index.php');
}

$error = '';
$success = '';
$username = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'])) {
        die("CSRF Token Verification Failed");
    }

    $username = sanitize_input($_POST['username']);
    $email = sanitize_input($_POST['email']);
    $user_type = sanitize_input($_POST['user_type']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation
    if (empty($username) || empty($email) || empty($password)) {
        $error = "All fields are required.";
    } elseif (!validate_email($email)) {
        $error = "Invalid email format.";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } else {
        $pass_check = validate_password($password);
        if (!$pass_check['valid']) {
            $error = $pass_check['message'];
        } else {
            // Check if username/email exists
            try {
                $db = getDB();
                $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
                $stmt->execute([$username, $email]);
                
                if ($stmt->fetchColumn() > 0) {
                    $error = "Username or Email already exists.";
                } else {
                    // Register
                    $hash = hash_password($password);
                    $sql = "INSERT INTO users (username, email, password_hash, user_type, created_at) VALUES (?, ?, ?, ?, NOW())";
                    $stmt = $db->prepare($sql);
                    
                    // Allow 'individual' or 'retailer', default to individual if invalid
                    $valid_types = ['individual', 'retailer'];
                    if (!in_array($user_type, $valid_types)) $user_type = 'individual';

                    if ($stmt->execute([$username, $email, $hash, $user_type])) {
                        $success = "Registration successful! You can now login.";
                        // Clear form
                        $username = '';
                        $email = '';
                    } else {
                        $error = "Registration failed. Please try again.";
                    }
                }
            } catch (PDOException $e) {
                error_log("Register Error: " . $e->getMessage());
                $error = "System error. Please try again later.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">
    
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <h4 class="fw-bold">Create Account</h4>
                            <p class="text-muted">Join the community</p>
                        </div>

                        <?php if ($error): ?>
                            <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                        <?php endif; ?>
                        
                        <?php if ($success): ?>
                            <div class="alert alert-success">
                                <?php echo htmlspecialchars($success); ?> 
                                <a href="login.php">Login here</a>.
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <?php csrf_token_field(); ?>
                            
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" name="username" class="form-control" value="<?php echo htmlspecialchars($username); ?>" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($email); ?>" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Account Type</label>
                                <select name="user_type" class="form-select">
                                    <option value="individual">Individual Collector</option>
                                    <option value="retailer">Retail Shop</option>
                                </select>
                            </div>

                            <div class="row mb-3">
                                <div class="col-6">
                                    <label class="form-label">Password</label>
                                    <input type="password" name="password" class="form-control" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label">Confirm Password</label>
                                    <input type="password" name="confirm_password" class="form-control" required>
                                </div>
                                <div class="form-text">Min 8 chars, 1 uppercase, 1 lowercase, 1 number.</div>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 mb-3">Register</button>
                            
                            <div class="text-center">
                                <p class="small text-muted">Already have an account? <a href="login.php">Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
