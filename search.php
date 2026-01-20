<?php
/**
 * Search Results Page
 */

require_once 'includes/config.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

start_secure_session();

$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$type = isset($_GET['type']) ? trim($_GET['type']) : '';
$results = [];

try {
    $db = getDB();

    // Search Analytics: Log the search term
    if (!empty($query)) {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to increment count
        $log_stmt = $db->prepare("INSERT INTO search_logs (term, search_count) VALUES (:term, 1) ON DUPLICATE KEY UPDATE search_count = search_count + 1");
        $log_stmt->execute([':term' => strtolower($query)]);
    }

    // Build Search Query
    $sql = "SELECT v.*, u.username FROM vinyl_listings v JOIN users u ON v.user_id = u.user_id WHERE v.is_active = 1 AND v.is_approved = 1";
    $params = [];

    if (!empty($query)) {
        $sql .= " AND (v.title LIKE :query OR v.artist_name LIKE :query)";
        $params[':query'] = '%' . $query . '%';
    }

    if (!empty($type)) {
        $sql .= " AND v.vinyl_type = :type";
        $params[':type'] = $type;
    }

    $sql .= " ORDER BY v.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

} catch (PDOException $e) {
    $error = "Search failed: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    
    <!-- Navbar (Simplified Include) -->
    <?php include 'includes/header.php'; // We should probably create this header file to DRY code ?>
    
    <!-- Temporary Inline Navbar if header.php doesn't exist yet -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
            <a class="navbar-brand" href="index.php"><?php echo SITE_NAME; ?></a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
                    <li class="nav-item"><a class="nav-link active" href="search.php">Browse</a></li>
                    <?php if (is_logged_in()): ?>
                        <li class="nav-item"><a class="nav-link" href="user/dashboard.php">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="logout.php">Logout</a></li>
                    <?php else: ?>
                        <li class="nav-item"><a class="nav-link" href="login.php">Login</a></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="row mb-4">
            <div class="col-md-8">
                <h2>Search Results</h2>
                <p class="text-muted">
                    Showing <?php echo count($results); ?> results for "<strong><?php echo htmlspecialchars($query); ?></strong>"
                    <?php if($type) echo " in " . htmlspecialchars($type); ?>
                </p>
            </div>
            <div class="col-md-4">
                <form action="search.php" method="GET" class="d-flex gap-2">
                    <input type="text" name="query" class="form-control" value="<?php echo htmlspecialchars($query); ?>" placeholder="Search...">
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
            </div>
        </div>

        <?php if (empty($results)): ?>
            <div class="alert alert-info py-5 text-center">
                <h4>No vinyls found</h4>
                <p>Try searching for a different artist or album.</p>
                <a href="index.php" class="btn btn-outline-primary mt-3">Back to Home</a>
            </div>
        <?php else: ?>
            <div class="row g-4">
                <?php foreach ($results as $vinyl): ?>
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 shadow-sm">
                            <img src="<?php echo htmlspecialchars($vinyl['image_url']); ?>" class="card-img-top" alt="Cover" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <span class="badge bg-<?php echo get_vinyl_type_badge($vinyl['vinyl_type']); ?> mb-2">
                                    <?php echo ucfirst($vinyl['vinyl_type']); ?>
                                </span>
                                <h5 class="card-title text-truncate"><?php echo htmlspecialchars($vinyl['title']); ?></h5>
                                <p class="card-text text-muted mb-1"><?php echo htmlspecialchars($vinyl['artist_name']); ?></p>
                                <p class="fw-bold text-primary"><?php echo format_price($vinyl['price']); ?></p>
                                <a href="vinyl-detail.php?id=<?php echo $vinyl['listing_id']; ?>" class="btn btn-sm btn-outline-dark w-100">View Details</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
