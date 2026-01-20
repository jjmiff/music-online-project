<?php
/**
 * Vinyl Detail Page
 */

require_once 'includes/config.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

start_secure_session();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$vinyl = null;

try {
    $db = getDB();
    // Fetch Vinyl Details
    $stmt = $db->prepare("SELECT v.*, u.username FROM vinyl_listings v JOIN users u ON v.user_id = u.user_id WHERE v.listing_id = ?");
    $stmt->execute([$id]);
    $vinyl = $stmt->fetch();

    if (!$vinyl) {
        die("Vinyl not found.");
    }

} catch (PDOException $e) {
    die("Error loading page.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($vinyl['title']); ?> - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
        <div class="container">
            <a class="navbar-brand" href="index.php"><?php echo SITE_NAME; ?></a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="search.php">Browse</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="row">
            <!-- Image Column -->
            <div class="col-md-5 mb-4">
                <img src="<?php echo htmlspecialchars($vinyl['image_url']); ?>" class="img-fluid rounded shadow" alt="Cover Art">
            </div>
            
            <!-- Details Column -->
            <div class="col-md-7">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                        <li class="breadcrumb-item"><a href="search.php">Browse</a></li>
                        <li class="breadcrumb-item active" aria-current="page"><?php echo htmlspecialchars($vinyl['title']); ?></li>
                    </ol>
                </nav>

                <h1 class="display-5 fw-bold"><?php echo htmlspecialchars($vinyl['title']); ?></h1>
                <h3 class="text-muted mb-4"><?php echo htmlspecialchars($vinyl['artist_name']); ?></h3>
                
                <div class="mb-4">
                    <span class="badge bg-<?php echo get_vinyl_type_badge($vinyl['vinyl_type']); ?> fs-6 me-2">
                        <?php echo ucfirst($vinyl['vinyl_type']); ?>
                    </span>
                    <span class="badge bg-secondary fs-6">
                        <?php echo htmlspecialchars($vinyl['genre']); ?>
                    </span>
                </div>

                <div class="card bg-light border-0 mb-4">
                    <div class="card-body">
                        <h2 class="text-primary fw-bold mb-0"><?php echo format_price($vinyl['price']); ?></h2>
                        <p class="text-muted small mb-0">Sold by: <?php echo htmlspecialchars($vinyl['username']); ?></p>
                    </div>
                </div>

                <div class="d-grid gap-2 mb-4">
                    <button class="btn btn-primary btn-lg">Add to Cart</button>
                    <button class="btn btn-outline-secondary">Contact Seller</button>
                </div>

                <h5 class="border-bottom pb-2 mb-3">Description</h5>
                <p class="lead text-muted fs-6"><?php echo nl2br(htmlspecialchars($vinyl['description'])); ?></p>
                
                <div class="row mt-4">
                    <div class="col-6">
                        <strong>Condition:</strong><br>
                        <?php echo htmlspecialchars($vinyl['condition_grade']); ?>
                    </div>
                    <div class="col-6">
                        <strong>Listed:</strong><br>
                        <?php echo format_date($vinyl['created_at']); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
