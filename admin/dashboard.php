<?php
/**
 * Admin Dashboard
 */

require_once '../includes/config.php';
require_once '../includes/db.php';
require_once '../includes/functions.php';

start_secure_session();
require_admin(); // Ensure only admins can access

$stats = [];
$top_searches = [];

try {
    $db = getDB();

    // 1. Fetch Stats
    // Total Vinyl Value
    $stmt = $db->query("SELECT SUM(price) FROM vinyl_listings WHERE is_active = 1");
    $stats['total_value'] = $stmt->fetchColumn() ?: 0;

    // Total Users
    $stmt = $db->query("SELECT COUNT(*) FROM users");
    $stats['total_users'] = $stmt->fetchColumn();

    // Pending Items (Example: Approved = 0)
    $stmt = $db->query("SELECT COUNT(*) FROM vinyl_listings WHERE is_approved = 0");
    $stats['pending_items'] = $stmt->fetchColumn();

    // 2. Fetch Search Analytics (Top 5)
    $stmt = $db->query("SELECT * FROM search_logs ORDER BY search_count DESC LIMIT 5");
    $top_searches = $stmt->fetchAll();

} catch (PDOException $e) {
    die("Error loading dashboard data.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container">
            <a class="navbar-brand" href="#">Admin Panel</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="dashboard.php">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="genres.php">Genre CMS</a></li>
                    <li class="nav-item"><a class="nav-link" href="../index.php">View Site</a></li>
                    <li class="nav-item"><a class="nav-link" href="../logout.php">Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <h2 class="mb-4">Dashboard Overview</h2>
        
        <!-- Stats Cards -->
        <div class="row g-4 mb-5">
            <div class="col-md-4">
                <div class="card bg-primary text-white h-100">
                    <div class="card-body text-center">
                        <h5>Total Platform Value</h5>
                        <h2 class="display-4 fw-bold"><?php echo format_price($stats['total_value']); ?></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                        <h5>Total Users</h5>
                        <h2 class="display-4 fw-bold"><?php echo $stats['total_users']; ?></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-warning text-dark h-100">
                    <div class="card-body text-center">
                        <h5>Pending Approvals</h5>
                        <h2 class="display-4 fw-bold"><?php echo $stats['pending_items']; ?></h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Analytics -->
        <div class="row">
            <div class="col-lg-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Top Search Trends (Analytics)</h5>
                    </div>
                    <div class="card-body">
                        <?php if (empty($top_searches)): ?>
                            <p class="text-muted">No search data recorded yet.</p>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Search Term</th>
                                            <th class="text-end">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($top_searches as $log): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars(ucfirst($log['term'])); ?></td>
                                                <td class="text-end fw-bold"><?php echo $log['search_count']; ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-3">
                            <a href="genres.php" class="btn btn-outline-danger btn-lg">Manage Genres (CMS)</a>
                            <button class="btn btn-outline-secondary btn-lg" disabled>Manage Users (Coming Soon)</button>
                            <button class="btn btn-outline-secondary btn-lg" disabled>Approve Listings (Coming Soon)</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
