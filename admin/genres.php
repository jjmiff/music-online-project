<?php
/**
 * Dynamic Genre Manager (CMS)
 */

require_once '../includes/config.php';
require_once '../includes/db.php';
require_once '../includes/functions.php';

start_secure_session();
require_admin();

$success = '';
$error = '';

try {
    $db = getDB();

    // Handle Add Genre
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        if ($_POST['action'] === 'add') {
            $name = sanitize_input($_POST['genre_name']);
            if (!empty($name)) {
                $stmt = $db->prepare("INSERT INTO genres (genre_name) VALUES (?)");
                if ($stmt->execute([$name])) {
                    $success = "Genre '$name' added successfully.";
                } else {
                    $error = "Failed to add genre.";
                }
            }
        } elseif ($_POST['action'] === 'delete') {
            $id = (int)$_POST['genre_id'];
            $stmt = $db->prepare("DELETE FROM genres WHERE genre_id = ?");
            if ($stmt->execute([$id])) {
                $success = "Genre deleted.";
            } else {
                $error = "Failed to delete genre.";
            }
        }
    }

    // Fetch All Genres
    $genres = $db->query("SELECT * FROM genres ORDER BY genre_name ASC")->fetchAll();

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genre Manager - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
</head>
<body>
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container">
            <a class="navbar-brand" href="dashboard.php">Admin Panel</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="dashboard.php">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link active" href="genres.php">Genre CMS</a></li>
                    <li class="nav-item"><a class="nav-link" href="../logout.php">Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <h2 class="mb-4">Content Management: Genres</h2>
        <p class="text-muted">Add or remove genres available in the vinyl listing form.</p>

        <?php if ($success): ?>
            <div class="alert alert-success alert-dismissible fae show">
                <?php echo htmlspecialchars($success); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="row">
            <div class="col-md-4">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">Add New Genre</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="">
                            <input type="hidden" name="action" value="add">
                            <div class="mb-3">
                                <label class="form-label">Genre Name</label>
                                <input type="text" name="genre_name" class="form-control" placeholder="e.g. Jazz" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Add Genre</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Existing Genres</h5>
                    </div>
                    <div class="card-body">
                        <?php if (empty($genres)): ?>
                            <p class="text-muted">No genres found.</p>
                        <?php else: ?>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Genre Name</th>
                                            <th class="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($genres as $genre): ?>
                                            <tr>
                                                <td><?php echo $genre['genre_id']; ?></td>
                                                <td><?php echo htmlspecialchars($genre['genre_name']); ?></td>
                                                <td class="text-end">
                                                    <form method="POST" action="" style="display:inline;">
                                                        <input type="hidden" name="action" value="delete">
                                                        <input type="hidden" name="genre_id" value="<?php echo $genre['genre_id']; ?>">
                                                        <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this genre?');">
                                                            <i class="bi bi-trash"></i> Delete
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
