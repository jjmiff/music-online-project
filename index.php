<?php
/**
 * Homepage - musicOnline.com
 */

require_once 'includes/config.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

start_secure_session();

// Get featured vinyl listings (approved only)
try {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT v.*, u.username, u.user_type 
        FROM vinyl_listings v 
        JOIN users u ON v.user_id = u.user_id 
        WHERE v.is_approved = 1 AND v.is_active = 1 
        ORDER BY v.created_at DESC 
        LIMIT 8
    ");
    $stmt->execute();
    $featured_vinyl = $stmt->fetchAll();
} catch (PDOException $e) {
    $featured_vinyl = [];
    $error_message = "Unable to load vinyl listings. ";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Vinyl Music Marketplace</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.php"><?php echo SITE_NAME; ?></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="search.php">Browse</a>
                    </li>
                    <?php if (is_logged_in()): ?>
                        <li class="nav-item">
                            <a class="nav-link" href="user/dashboard.php">My Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="logout.php">Logout</a>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="register.php">Register</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="login.php">Login</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-primary text-white py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-3">Find Your Perfect Vinyl</h1>
                    <p class="lead mb-4">Buy and sell vinyl records from collectors and retailers worldwide</p>
                </div>
                <div class="col-lg-6">
                    <!-- Search Form -->
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Search Vinyl</h5>
                            <form action="search.php" method="GET">
                                <div class="mb-3">
                                    <input type="text" name="query" class="form-control" placeholder="Search by artist or title" required>
                                </div>
                                <div class="mb-3">
                                    <select name="type" class="form-select">
                                        <option value="">All Types</option>
                                        <option value="album">Albums</option>
                                        <option value="single">Singles</option>
                                        <option value="ep">EPs</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Vinyl -->
    <div class="container my-5">
        <h2 class="mb-4">Featured Vinyl</h2>
        
        <?php if (isset($error_message)): ?>
            <?php show_error($error_message); ?>
        <?php endif; ?>

        <div class="row g-4">
            <?php if (empty($featured_vinyl)): ?>
                <div class="col-12">
                    <div class="alert alert-info">No vinyl listings available yet. Be the first to add one!</div>
                </div>
            <?php else: ?>
                <?php foreach ($featured_vinyl as $vinyl): ?>
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="<?php echo htmlspecialchars($vinyl['image_url']); ?>" 
                                 class="card-img-top" 
                                 alt="<?php echo htmlspecialchars($vinyl['title']); ?>"
                                 style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <span class="badge bg-<?php echo get_vinyl_type_badge($vinyl['vinyl_type']); ?> mb-2">
                                    <?php echo ucfirst($vinyl['vinyl_type']); ?>
                                </span>
                                <h5 class="card-title"><?php echo htmlspecialchars($vinyl['title']); ?></h5>
                                <p class="card-text text-muted"><?php echo htmlspecialchars($vinyl['artist_name']); ?></p>
                                <p class="card-text fw-bold"><?php echo format_price($vinyl['price']); ?></p>
                                <p class="card-text"><small class="text-muted">Condition: <?php echo htmlspecialchars($vinyl['condition_grade']); ?></small></p>
                                <a href="vinyl-detail.php?id=<?php echo $vinyl['listing_id']; ?>" class="btn btn-outline-primary btn-sm">View Details</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container text-center">
            <p>&copy; 2026 <?php echo SITE_NAME; ?>. Student Project - Educational Purposes Only.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>